import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product } from '../product/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const product = await this.productModel.findById(addToCartDto.productId).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      const created = new this.cartModel({ user: userId, products: [product._id], quantity: addToCartDto.quantity, totalPrice: product.price * addToCartDto.quantity });
      return created.save();
    }

    cart.products.push(product._id);
    cart.quantity += addToCartDto.quantity;
    cart.totalPrice += product.price * addToCartDto.quantity;
    return cart.save();
  }
}
