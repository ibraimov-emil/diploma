import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class SendMessageDto {
    // @ApiProperty({example: '1', description: 'ID отправителя'})
    // @IsNumber({}, { message: 'senderId должен быть числом' })
    // readonly senderId: number;

    @ApiProperty({example: 'Привет, это сообщение', description: 'Текст сообщения'})
    @IsString({message: 'Должно быть строкой'})
    readonly content: string;
}
