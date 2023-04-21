import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";
// import { CreateUserDto } from './create-user.dto';
import {CreateEmployeeDto} from "./create-employee.dto";


export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

