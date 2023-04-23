import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { User } from "../users/users.model";
import { Role } from "../roles/roles.model";
import { EmployeeRoles } from "../roles/employee-roles.model";
import {ApiProperty} from "@nestjs/swagger";
import {RequestTable} from "../requests/requests.model";

interface ServiceCreationAttrs {
    name: string;
    description: string;
}

@Table({tableName: 'services'})
export class Service extends Model<Service, ServiceCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Разработка веб-приложения', description: 'Название услуги'})
    @Column({ type: DataType.STRING, allowNull: true})
    name: string;

    @ApiProperty({example: 'Включает в себя, разработку сервера и клиента с использованием технологий NestJS, PostgresQL, React, ModeJS', description: 'Описание'})
    @Column({ type: DataType.STRING})
    description: string;
    //
    @HasMany(() => RequestTable)
    requests: RequestTable[];


}
