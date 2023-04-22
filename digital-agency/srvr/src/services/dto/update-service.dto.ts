import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";
// import { CreateUserDto } from './create-user.dto';
import {CreateServiceDto} from "./create-service.dto";


export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

