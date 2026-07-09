import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { User } from '../../users/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }], default: [] })
  products: Types.ObjectId[];

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: 'cash' })
  paymentMethod: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop({ default: '' })
  coupon: string;

  @Prop({ type: Date, default: null })
  paidAt: Date | null;

  @Prop({ type: Date, default: null })
  deliveredAt: Date | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
