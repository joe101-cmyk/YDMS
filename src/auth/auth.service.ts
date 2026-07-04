import { Injectable } from "@nestjs/common";
import { User, UserModelName } from "../DB/models/user.model";
import { HydratedDocument, Model } from "mongoose";
import {create_user_Dto} from "../DTO/dto"
import { InjectModel } from "@nestjs/mongoose";
import { hashPassword } from "../security/hash";
@Injectable()
export class Auth_service{
    constructor(@InjectModel(User.name) private readonly UserModelName:Model<HydratedDocument<User>>, ){}
    async signup(create_user_Dto:create_user_Dto){
        const existingUser = await this.UserModelName.findOne({ email: create_user_Dto.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const newUser = new this.UserModelName({
            name: create_user_Dto.username,
            email: create_user_Dto.email,
            password: create_user_Dto.password,
            provider: create_user_Dto.provider || 'system',
            role: create_user_Dto.role,
        });
        await newUser.save();
        return newUser;
    } 


}