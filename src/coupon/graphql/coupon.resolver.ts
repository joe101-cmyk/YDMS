import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { CouponService } from '../coupon.service';
import { CreateCouponInput } from './coupon.input';
import { CouponObjectType } from './coupon.type';

@Resolver(() => CouponObjectType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CouponResolver {
  constructor(private readonly couponService: CouponService) {}

  @Query(() => [CouponObjectType], { name: 'findAllCoupons' })
  findAll() {
    return this.couponService.findAll();
  }

  @Mutation(() => CouponObjectType, { name: 'createCoupon' })
  @Roles('admin')
  create(@Args('input') input: CreateCouponInput) {
    return this.couponService.create(input as CreateCouponDto);
  }
}
