import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length, IsNumber} from "class-validator";

export class CreateClientRequestDto {

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

    @ApiProperty({example: '2', description: 'ID услуги'})
    @IsNumber({}, { message: 'serviceId должен быть числом' })
    readonly serviceId: number;

    @ApiProperty({example: 'Необходимо разработать приложения для продажи велосипедов', description: 'Описание'})
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;
}
