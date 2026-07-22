import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({ example: 'SUMMER25' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 25, minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  isPercentage?: boolean;

  @ApiProperty({ example: '2027-01-01', format: 'date' })
  @IsDateString()
  expires: string;

  @ApiPropertyOptional({ example: 'admin-user-id' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
