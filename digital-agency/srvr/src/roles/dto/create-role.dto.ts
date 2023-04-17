import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({example: 'ADMIN', description: 'Уникальное Значение роли '})
    readonly value: string;
    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    readonly description: string;
}
