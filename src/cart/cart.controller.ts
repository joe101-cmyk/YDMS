import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/types/request-with-user';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add product to cart' })
  addToCart(@Req() req: RequestWithUser, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user!.id, addToCartDto);
  }
}
