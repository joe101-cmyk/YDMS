import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cart } from '../cart/schemas/cart.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart is empty');
    }

    const created = new this.orderModel({
      user: userId,
      products: cart.products,
      address: createOrderDto.address,
      phone: createOrderDto.phone,
      paymentMethod: createOrderDto.paymentMethod || 'cash',
      coupon: createOrderDto.coupon || '',
      totalPrice: cart.totalPrice,
    });

    await created.save();
    await this.cartModel.deleteOne({ user: userId });
    return created;
  }
}
