import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @ApiProperty({example: 'admin@adm.ru', description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;
    @ApiProperty({example: '12345678', description: 'пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;
    @ApiProperty({example: '+7978888888', description: 'телефон'})
    @IsString({message: 'Должно быть строкой'})
    readonly phone: string;
    @ApiProperty({example: 'Ибраимов', description: 'Фамилия'})
    @IsString({message: 'Должно быть строкой'})
    readonly surname: string;
    @ApiProperty({example: 'Эмиль', description: 'Имя'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;
}
