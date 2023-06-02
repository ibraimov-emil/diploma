import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { User } from "../users/users.model";
import { Role } from "../roles/roles.model";
import { EmployeeRoles } from "../roles/employee-roles.model";
import {ApiProperty} from "@nestjs/swagger";
import {RequestTable} from "../requests/requests.model";
import {Project} from "../projects/projects.model";
import {Stage} from "../stages/stage.model";

interface StatusCreationAttrs {
    name: string;
}

@Table({tableName: 'statuses'})
export class Status extends Model<Status, StatusCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Разработка веб-приложения', description: 'Название услуги'})
    @Column({ type: DataType.STRING, allowNull: true})
    name: string;

    @HasMany(() => RequestTable)
    requests: RequestTable[];

    @HasMany(() => Project)
    projects: Project[];

    @HasMany(() => Project)
    stages: Stage[];
}
