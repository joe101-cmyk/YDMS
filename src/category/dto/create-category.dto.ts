import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  @Length(3, 50, { message: 'Category name must be between 3 and 50 characters' })
  name: string;

  @IsOptional()
  @IsString()
  image?: string;
}
