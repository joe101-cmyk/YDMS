import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { toSlug } from '../common/utils/slug.util';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const slug = toSlug(createProductDto.title);
    const existing = await this.productModel.findOne({ slug });
    if (existing) {
      throw new BadRequestException('Product already exists');
    }

    const created = new this.productModel({
      ...createProductDto,
      slug,
      createdBy: createProductDto.createdBy || new Types.ObjectId().toString(),
    });

    return created.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find({ isDeleted: false }).populate('category brand createdBy').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ _id: id, isDeleted: false }).populate('category brand createdBy').exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product || product.isDeleted) {
      throw new NotFoundException('Product not found');
    }
    const payload = { ...updateProductDto } as any;
    if (updateProductDto.title) {
      payload.slug = toSlug(updateProductDto.title);
    }
    const updated = await this.productModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    return updated as Product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }
}
