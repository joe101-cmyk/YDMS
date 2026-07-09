import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UserRole } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({ email: createUserDto.email });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const created = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.USER,
    });

    return created.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isDeleted: false }).select('+password').exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async softDelete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
