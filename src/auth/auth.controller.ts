import { Body, Controller, Get, Param, Post, ValidationPipe } from "@nestjs/common";
import { create_user_Dto } from "../DTO/dto";

@Controller("auth")
export class auth_contoller
{
    @Get("/:id")
    findone(@Param ('id') id:number){
        return {userId:id,type :typeof id}
    }


    @Post("/register")
    signup(@Body(new ValidationPipe) create_user_Dto:create_user_Dto){
        return {status:"Success" , data:create_user_Dto}
    }
}