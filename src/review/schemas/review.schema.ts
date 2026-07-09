import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { User } from '../../users/schemas/user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ default: '' })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
