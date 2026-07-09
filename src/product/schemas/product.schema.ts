import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../category/schemas/category.schema';
import { Brand } from '../../brand/schemas/brand.schema';
import { User } from '../../users/schemas/user.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Product {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop({ default: 0, min: 0 })
  finalPrice: number;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop({ default: 0, min: 0 })
  sold: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Brand.name, required: true })
  brand: Types.ObjectId;

  @Prop({ default: 0, min: 0 })
  ratingsAverage: number;

  @Prop({ default: 0, min: 0 })
  ratingsQuantity: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.virtual('id').get(function (this: ProductDocument) {
  return this._id.toString();
});
ProductSchema.index({ title: 'text', description: 'text' });

ProductSchema.pre('save', function (next: (err?: Error) => void) {
  this.finalPrice = this.discount > 0 ? this.price - (this.price * this.discount) / 100 : this.price;
  next();
});
