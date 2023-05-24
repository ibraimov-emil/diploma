import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Service} from "../services/services.model";
import {Client} from "../clients/clients.model";
import {Status} from "../statuses/statuses.model";
import {Project} from "../projects/projects.model";

interface RequestCreationAttrs {
    description: string;
    serviceId: number;
    clientId: number;
    statusId: number;
}

@Table({tableName: 'requests'})
export class RequestTable extends Model<RequestTable, RequestCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Необходимо разработать приложения для продажи велосипедов', description: 'Описание'})
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

    @BelongsTo(() => Client)
    client: Client

    @BelongsTo(() => Service)
    service: Service

    @BelongsTo(() => Status)
    status: Status

    @HasMany(() => Project)
    projects: Project[];

    //
    // @BelongsToMany(() => Role, () => EmployeeRoles)
    // roles: Role[];
}
