import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  images?: string[];

  @Field(() => ID)
  @IsMongoId()
  category: string;

  @Field(() => ID)
  @IsMongoId()
  brand: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  images?: string[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  category?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  brand?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}
