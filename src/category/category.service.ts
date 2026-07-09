import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { toSlug } from '../common/utils/slug.util';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = toSlug(createCategoryDto.name);
    const existing = await this.categoryModel.findOne({ slug });
    if (existing) {
      throw new BadRequestException('Category already exists');
    }
    const created = new this.categoryModel({ ...createCategoryDto, slug });
    return created.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const payload = { ...updateCategoryDto } as any;
    if (updateCategoryDto.name) {
      payload.slug = toSlug(updateCategoryDto.name);
    }
    const updated = await this.categoryModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    return updated as Category;
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }
}
