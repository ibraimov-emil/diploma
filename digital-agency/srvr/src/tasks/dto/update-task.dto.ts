import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsBoolean, IsEmail, IsString, Length} from "class-validator";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({example: 'True', description: 'Задача выполнена?'})
    @IsBoolean({message: 'Должно быть логическим значением'})
    readonly complete: boolean;
}

