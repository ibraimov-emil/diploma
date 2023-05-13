import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreateStageDto {


    @ApiProperty({example: '2', description: 'ID услуги'})
    @IsNumber({}, { message: 'serviceId должен быть числом' })
    readonly projectId: number;

    @ApiProperty({example: '1', description: 'ID клиента'})
    @IsNumber({}, { message: 'clientId должен быть числом' })
    readonly statusId: number;

    @ApiProperty({example: 'Необходимо разработать приложения для продажи велосипедов', description: 'Описание'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;
}
