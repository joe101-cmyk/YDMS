import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsBoolean()
  isPercentage?: boolean;

  @IsDateString()
  expires: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}
