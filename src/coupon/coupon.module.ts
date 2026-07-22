import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { Coupon, CouponSchema } from './schemas/coupon.schema';
import { CouponResolver } from './graphql/coupon.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])],
  controllers: [CouponController],
  providers: [CouponService, CouponResolver],
  exports: [CouponService],
})
export class CouponModule {}
