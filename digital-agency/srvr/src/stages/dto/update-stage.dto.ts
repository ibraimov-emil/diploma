import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";
import {CreateStageDto} from "./create-stage.dto";

export class UpdateStageDto extends PartialType(CreateStageDto) {}

