import { Module } from "@nestjs/common";
import { auth_contoller } from "./auth.controller";
import { Auth_service } from "./auth.service";
import { UserModelName } from "../DB/models/user.model";

@Module({
    imports:[UserModelName],
    controllers:[auth_contoller],
    providers:[Auth_service],
})

export class auth_module {

}