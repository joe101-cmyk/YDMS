import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Product')
export class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  discount: number;

  @Field(() => Float)
  finalPrice: number;

  @Field(() => Int)
  stock: number;

  @Field(() => Int)
  sold: number;

  @Field(() => [String])
  images: string[];

  @Field(() => ID)
  category: string;

  @Field(() => ID)
  brand: string;

  @Field(() => Float)
  ratingsAverage: number;

  @Field(() => Int)
  ratingsQuantity: number;

  @Field(() => ID)
  createdBy: string;

  @Field()
  isDeleted: boolean;
}
