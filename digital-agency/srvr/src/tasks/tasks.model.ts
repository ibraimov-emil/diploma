import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Stage} from "../stages/stage.model";
import {Employee} from "../employees/employees.model";
import { EmployeesTasks } from "./employees-tasks.model";
import {Status} from "../statuses/statuses.model";

interface TaskCreationAttrs {
    name: string;
    description: string;
    stageId: number;
    deadline: string;
}

@Table({tableName: 'tasks'})
export class Task extends Model<Task, TaskCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Разработка ТЗ', description: 'Название'})
    @Column({ type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: 'Необходимо сделать ТЗ', description: 'Описание'})
    @Column({ type: DataType.STRING, allowNull: true})
    description: string;

    @ApiProperty({example: 'Необходимо сделать ТЗ', description: 'Описание'})
    @Column({ type: DataType.BOOLEAN, defaultValue: false})
    complete: boolean;

    @ForeignKey(() => Status)
    @Column({type: DataType.INTEGER})
    statusId: number;

    @ForeignKey(() => Stage)
    @Column({type: DataType.INTEGER})
    stageId: number;

    @BelongsTo(() => Stage)
    stage: Stage;

    @BelongsToMany(() => Employee, () => EmployeesTasks)
    employees: Employee[];
}
