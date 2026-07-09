import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty({ message: 'Brand name is required' })
  @Length(3, 50, { message: 'Brand name must be between 3 and 50 characters' })
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
