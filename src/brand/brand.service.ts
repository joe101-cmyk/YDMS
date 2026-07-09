import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { toSlug } from '../common/utils/slug.util';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const slug = toSlug(createBrandDto.name);
    const existing = await this.brandModel.findOne({ slug });
    if (existing) {
      throw new BadRequestException('Brand already exists');
    }
    const created = new this.brandModel({ ...createBrandDto, slug });
    return created.save();
  }

  async findAll(): Promise<Brand[]> {
    return this.brandModel.find().exec();
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const payload = { ...updateBrandDto } as any;
    if (updateBrandDto.name) {
      payload.slug = toSlug(updateBrandDto.name);
    }
    const updated = await this.brandModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    return updated as Brand;
  }

  async remove(id: string): Promise<void> {
    const brand = await this.brandModel.findByIdAndDelete(id).exec();
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
  }
}
