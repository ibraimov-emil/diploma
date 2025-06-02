import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsEnum, IsOptional, IsString, Length} from "class-validator";
import { CreateProjectDto } from "./create-project.dto";

export enum ProjectStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    ON_HOLD = 'on_hold',
    CANCELLED = 'cancelled'
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @ApiProperty({example: 'completed', description: 'Статус проекта', enum: ProjectStatus})
    @IsOptional()
    @IsEnum(ProjectStatus)
    readonly status?: ProjectStatus;
}

