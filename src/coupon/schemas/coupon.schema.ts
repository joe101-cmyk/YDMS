import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: false })
  isPercentage: boolean;

  @Prop({ type: Date, required: true })
  expires: Date;

  @Prop({ default: '' })
  createdBy: string;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
