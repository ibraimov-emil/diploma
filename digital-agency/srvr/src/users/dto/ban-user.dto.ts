import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString} from "class-validator";

export class BanUserDto {
    @ApiProperty({example: '1', description: 'ID пользователя'})
    @IsNumber({}, { message: 'userId должен быть числом' })
    readonly userId: number;
    @ApiProperty({example: 'Неадекватен', description: 'Причина бана'})
    @IsString({message: 'Должно быть строкой'})
    readonly banReason: string;
}
