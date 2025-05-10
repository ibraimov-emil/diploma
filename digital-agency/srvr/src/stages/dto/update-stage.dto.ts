import {ApiProperty, PartialType} from "@nestjs/swagger";
import {IsEmail, IsNumber, IsOptional, IsString, Length} from "class-validator";
import {CreateStageDto} from "./create-stage.dto";
import {Column, DataType, ForeignKey} from "sequelize-typescript";
import {Payment} from "../payment.model";

export class UpdateStageDto extends PartialType(CreateStageDto) {
    @ApiProperty({example: 'Canceled', description: 'Платежный статус'})
    readonly paymentStatus: string;
    @ApiProperty({example: 'dw3213equ3rehwerrwer', description: 'Платежный токен'})
    readonly paymentId: string;
    @ApiProperty({example: 'https://yookassa.ru/dsakfkjsdj', description: 'Платежный адрес на форму оплаты'})
    readonly paymentLink: string;
    @ApiProperty({example: '25000', description: 'Стоимость выполнения этапа'})
    @IsOptional()
    @IsNumber({}, { message: 'cost должен быть числом' })
    readonly cost: number;
}

