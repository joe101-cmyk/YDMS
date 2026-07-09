import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  coupon?: string;
}
