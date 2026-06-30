import { Module } from "@nestjs/common";
import { auth_contoller } from "./auth.controller";
import { Auth_service } from "./auth.service";

@Module({
    imports:[],
    controllers:[auth_contoller],
    providers:[Auth_service],
})

export class auth_module {

}