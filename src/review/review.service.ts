import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { Product } from '../product/schemas/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    const product = await this.productModel.findById(createReviewDto.productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.reviewModel.findOne({ user: userId, product: createReviewDto.productId });
    if (existing) {
      throw new BadRequestException('You already reviewed this product');
    }

    const created = new this.reviewModel({ ...createReviewDto, user: userId, product: createReviewDto.productId });
    await created.save();
    return created;
  }
}
