import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Service} from "../services/services.model";
import {Client} from "../clients/clients.model";
import {Status} from "../statuses/statuses.model";
import {RequestTable} from "../requests/requests.model";
import {User} from "../users/users.model";
import {Stage} from "../stages/stage.model";

interface ProjectCreationAttrs {
    name: string;
    description: string;
    requestId: number;
    serviceId: number;
    clientId: number;
    statusId: number;
}

@Table({tableName: 'projects'})
export class Project extends Model<Project, ProjectCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Поиск дешёвых авиабилетов', description: 'Название'})
    @Column({ type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: 'Разработка веб-приложения на NestJS + React', description: 'Описание'})
    @Column({ type: DataType.STRING, allowNull: true})
    description: string;

    @ForeignKey(() => Service)
    @Column({type: DataType.INTEGER})
    serviceId: number;

    @ForeignKey(() => Client)
    @Column({type: DataType.INTEGER})
    clientId: number;

    @ForeignKey(() => Status)
    @Column({type: DataType.INTEGER})
    statusId: number;

    @ForeignKey(() => RequestTable)
    @Column({type: DataType.INTEGER})
    requestId: number;

    @BelongsTo(() => RequestTable)
    request: RequestTable

    @BelongsTo(() => Service)
    service: Service

    @BelongsTo(() => Client)
    client: Client

    @BelongsTo(() => Status)
    status: Status

    @HasMany(() => Project)
    stages: Stage[];

    //
    // @BelongsToMany(() => Role, () => EmployeeRoles)
    // roles: Role[];
}
