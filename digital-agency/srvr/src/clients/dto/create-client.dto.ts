import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreateClientDto {

    @ApiProperty({example: '2', description: 'ID пользователя'})
    @IsNumber({}, { message: 'userId должен быть числом' })
    readonly userId: number;
}
