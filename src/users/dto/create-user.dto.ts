import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
