import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreateServiceDto {

    @ApiProperty({example: 'Разработка веб-приложения', description: 'Название услуги'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;
    @ApiProperty({example: 'Включает в себя, разработку сервера и клиента с использованием технологий NestJS, PostgresQL, React, ModeJS', description: 'Описание'})
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;
}
