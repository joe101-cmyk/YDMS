import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({ default: '' })
  logo: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
BrandSchema.index({ name: 'text', slug: 'text' });
