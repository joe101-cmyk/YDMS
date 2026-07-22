import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Coupon')
export class CouponObjectType {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => Float)
  amount: number;

  @Field()
  isPercentage: boolean;

  @Field()
  expires: Date;

  @Field()
  createdBy: string;
}
