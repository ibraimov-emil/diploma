import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

import {CreateRoleDto} from "./create-role.dto";


export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

