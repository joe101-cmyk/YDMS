import { Transform } from "class-transformer";
import { IsEmail, IsEnum, isEnum, IsNotEmpty, isNotEmpty, IsOptional, IsString, isStrongPassword, IsStrongPassword, Length, length } from "class-validator";
import { providerEnum, RoleEnum } from "../enum/user.enum";

export class create_user_Dto {
    
    @IsString()
    @Length(3,20,{
        message:"User name at least 3 max 20",
    })
    username: string;
    
    @IsStrongPassword({
    minLength: 8, 
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1, 
    minSymbols: 1,   
    })
    password:string
    @IsEmail({},{message:"Check Email Formate "})
    @IsNotEmpty()
    email:string;

    @IsEnum(providerEnum,{
        message:"Provider must be google, facebook or system"
    })
    @IsOptional()
    provider!:providerEnum;
    @IsEnum(RoleEnum,{
        message:"Role User or Admin"
    })
    role!:RoleEnum;
}