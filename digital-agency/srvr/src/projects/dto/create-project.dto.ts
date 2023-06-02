import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsOptional, IsString, Length} from "class-validator";

export class CreateProjectDto {

    @ApiProperty({example: '1', description: 'ID заявки'})
    @IsOptional()
    @IsNumber({}, { message: 'requestId должен быть числом' })
    readonly requestId?: number;

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
}
