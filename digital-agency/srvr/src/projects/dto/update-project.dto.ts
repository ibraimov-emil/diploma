import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";
import { CreateProjectDto } from "./create-project.dto";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

