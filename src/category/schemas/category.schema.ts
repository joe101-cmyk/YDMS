import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ default: '' })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ name: 'text', slug: 'text' });
