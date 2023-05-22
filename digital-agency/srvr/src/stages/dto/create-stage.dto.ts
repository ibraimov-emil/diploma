import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreateStageDto {


    @ApiProperty({example: '2', description: 'ID услуги'})
    @IsNumber({}, { message: 'serviceId должен быть числом' })
    readonly projectId: number;

    @ApiProperty({example: '1', description: 'ID клиента'})
    @IsNumber({}, { message: 'statusId должен быть числом' })
    readonly statusId: number;

    @ApiProperty({example: 'Формирование ТЗ', description: 'Описание'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;
}
