import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class AddUserToChatDto {
    @ApiProperty({example: '1', description: 'ID пользователя'})
    @IsNumber({}, { message: 'userId должен быть числом' })
    readonly userId: number;
}
