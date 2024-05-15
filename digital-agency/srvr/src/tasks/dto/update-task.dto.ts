import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsBoolean, IsEmail, IsOptional, IsString, Length} from "class-validator";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

}

