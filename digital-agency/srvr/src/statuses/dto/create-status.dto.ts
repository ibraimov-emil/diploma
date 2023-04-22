import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreateStatusDto {

    @ApiProperty({example: 'На рассмотрении', description: 'Название статуса'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;
}
