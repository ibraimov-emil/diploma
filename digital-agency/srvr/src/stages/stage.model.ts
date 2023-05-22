import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Service} from "../services/services.model";
import {Client} from "../clients/clients.model";
import {Status} from "../statuses/statuses.model";
import {Project} from "../projects/projects.model";
import { Task } from "src/tasks/tasks.model";

interface StageCreationAttrs {
    name: string;
    projectId: number;
    statusId: number;
}

@Table({tableName: 'stages'})
export class Stage extends Model<Stage, StageCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Дизайн', description: 'Название этапа'})
    @Column({ type: DataType.STRING, allowNull: false})
    name: string;

    @ForeignKey(() => Project)
    @Column({type: DataType.INTEGER, allowNull: false})
    projectId: number;

    @ForeignKey(() => Status)
    @Column({type: DataType.INTEGER})
    statusId: number;

    @BelongsTo(() => Status)
    status: Status

    @BelongsTo(() => Project)
    project: Project;

    @HasMany(() => Task)
    tasks: Task[];
}
