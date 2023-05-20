import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";
import { CreateUserDto } from './create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({example: 'Рефреш', description: 'Токен'})
    readonly refreshToken: any;
}

