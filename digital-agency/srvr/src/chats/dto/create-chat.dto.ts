import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, Length} from "class-validator";

export class CreateChatDto {
    @ApiProperty({example: 'Заявка №32', description: 'Название чата'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    // @ApiProperty({example: '1', description: 'ID создателя'})
    // @IsNumber({}, { message: 'creatorId должен быть числом' })
    // readonly creatorId: number;
}
