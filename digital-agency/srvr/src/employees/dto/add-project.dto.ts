import {IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AddProjectDto {
    @ApiProperty({example: '1', description: 'ID сотрудника'})
    @IsNumber({}, {message: "Должно быть числом"})
    readonly employeeId: number;
    @ApiProperty({example: '1', description: 'ID проекта'})
    @IsNumber({}, {message: "Должно быть числом"})
    readonly projectId: number;
}
