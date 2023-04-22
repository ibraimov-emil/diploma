import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";
import {CreateStatusDto} from "./create-status.dto";

export class UpdateStatusDto extends PartialType(CreateStatusDto) {}

