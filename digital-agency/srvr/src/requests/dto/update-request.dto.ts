import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";
import {CreateRequestDto} from "./create-request.dto";

export class UpdateRequestDto extends PartialType(CreateRequestDto) {}

