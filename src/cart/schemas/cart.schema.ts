import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { User } from '../../users/schemas/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }], default: [] })
  products: Types.ObjectId[];

  @Prop({ default: 1 })
  quantity: number;

  @Prop({ default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
