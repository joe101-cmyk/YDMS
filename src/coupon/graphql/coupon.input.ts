import { Field, Float, InputType } from '@nestjs/graphql';
import { CreateCouponDto } from '../dto/create-coupon.dto';

@InputType()
export class CreateCouponInput extends CreateCouponDto {
  @Field()
  declare code: string;

  @Field(() => Float)
  declare amount: number;

  @Field({ nullable: true })
  declare isPercentage?: boolean;

  @Field()
  declare expires: string;

  @Field({ nullable: true })
  declare createdBy?: string;
}
