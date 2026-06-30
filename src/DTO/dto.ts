import { IsString, isStrongPassword, IsStrongPassword, Length, length } from "class-validator";

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
    password:number

}