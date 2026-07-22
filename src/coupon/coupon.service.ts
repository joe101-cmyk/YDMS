import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const existing = await this.couponModel.findOne({ code: createCouponDto.code.toUpperCase() });
    if (existing) {
      throw new BadRequestException('Coupon already exists');
    }
    const created = new this.couponModel({ ...createCouponDto, code: createCouponDto.code.toUpperCase() });
    return created.save();
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().exec();
  }

  async validate(code: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() }).exec();
    if (!coupon || coupon.expires < new Date()) {
      throw new BadRequestException('Coupon is invalid or expired');
    }
    return coupon;
  }
}
