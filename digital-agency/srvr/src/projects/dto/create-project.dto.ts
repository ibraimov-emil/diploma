import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsDate, IsEmail, IsNumber, IsOptional, IsString, Length} from "class-validator";
import {Type} from "class-transformer";

export class CreateProjectDto {

    @ApiProperty({example: '1', description: 'ID заявки'})
    @IsOptional()
    @IsNumber({}, { message: 'requestId должен быть числом' })
    readonly requestId?: number;

    @ApiProperty({example: '2024-03-18T12:00:00Z', description: 'Дата создания заявки'})
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly requestCreatedAt?: Date;

    @ApiProperty({example: '2', description: 'ID услуги'})
    @IsNumber({}, { message: 'serviceId должен быть числом' })
    readonly serviceId: number;

    @ApiProperty({example: '1', description: 'ID клиента'})
    @IsNumber({}, { message: 'clientId должен быть числом' })
    readonly clientId: number;

    @ApiProperty({example: '1', description: 'ID статуса'})
    @IsOptional()
    @IsNumber({}, { message: 'statusId должен быть числом' })
    readonly statusId?: number;

    @ApiProperty({example: 'Поиск дешёвых авиабилетов', description: 'Название'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @ApiProperty({example: 'Разработка веб-приложения на NestJS + React', description: 'Описание'})
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;

    @ApiProperty({ example: [1, 2, 3], description: 'Массив ID сотрудников' })
    @IsArray()
    @IsNumber({}, { each: true, message: 'Каждый элемент массива должен быть числом' })
    readonly employeesIds: number[];
}
