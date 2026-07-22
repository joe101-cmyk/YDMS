import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a coupon' })
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  @ApiResponse({ status: 400, description: 'Coupon code already exists or request is invalid' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a coupon' })
  @ApiResponse({ status: 201, description: 'Coupon is valid and not expired' })
  @ApiResponse({ status: 400, description: 'Coupon is invalid or expired' })
  validate(@Body('code') code: string) {
    return this.couponService.validate(code);
  }
}
