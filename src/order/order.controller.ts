import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/types/request-with-user';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  create(@Req() req: RequestWithUser, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(req.user!.id, createOrderDto);
  }
}
