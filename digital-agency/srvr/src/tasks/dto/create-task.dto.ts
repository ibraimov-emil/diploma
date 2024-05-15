import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, IsDate, IsEmail, IsNumber, IsOptional, IsString, Length} from "class-validator";

export class CreateTaskDto {

    @ApiProperty({example: '1', description: 'ID этапа'})
    @IsNumber({}, { message: 'stageId должен быть числом' })
    readonly stageId: number;

    @ApiProperty({example: 'Разработка ТЗ', description: 'Название'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @ApiProperty({example: 'Необходимо сделать ТЗ', description: 'Описание'})
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;

    @ApiPropertyOptional({description: 'Дедлайн'})
    @IsOptional()
    @IsString({message: 'Должно быть датой'})
    readonly deadline: string;

    @ApiProperty({example: '1', description: 'ID статуса'})
    @IsOptional()
    @IsNumber({}, { message: 'statusId должен быть числом' })
    readonly statusId?: number;

    @ApiProperty({ example: [1, 2, 3], description: 'Массив ID сотрудников' })
    @IsArray()
    @IsNumber({}, { each: true, message: 'Каждый элемент массива должен быть числом' })
    readonly employeesIds: number[];
}
