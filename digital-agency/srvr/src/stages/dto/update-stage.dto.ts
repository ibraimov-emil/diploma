import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";
import {CreateStageWorktDto} from "./create-stageWork.dto";

export class UpdateStageWorkDto extends PartialType(CreateStageWorktDto) {}

