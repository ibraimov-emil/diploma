import {ApiProperty} from "@nestjs/swagger";
import {IsDate, IsEmail, IsNumber, IsString, Length} from "class-validator";

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

    // @ApiProperty({example: '05.06.2023', description: 'Описание'})
    // @IsDate({message: 'Должно быть датой'})
    // readonly deadline: Date;
}
