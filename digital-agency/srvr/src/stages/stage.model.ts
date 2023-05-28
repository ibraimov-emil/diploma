import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Status} from "../statuses/statuses.model";
import {Project} from "../projects/projects.model";
import { Task } from "src/tasks/tasks.model";
import {Payment} from "./payment.model";

interface StageCreationAttrs {
    name: string;
    projectId: number;
    statusId: number;
    paymentId: string;
}

@Table({tableName: 'stages'})
export class Stage extends Model<Stage, StageCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Дизайн', description: 'Название этапа'})
    @Column({ type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: '23000', description: 'Стоимость выполнения этапа'})
    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    cost: number;

    @Column({ type: DataType.STRING, allowNull: true })
    paymentLink: string;

    @Column({ type: DataType.STRING, allowNull: true })
    paymentStatus: string;

    @ForeignKey(() => Project)
    @Column({type: DataType.INTEGER, allowNull: false})
    projectId: number;

    @ForeignKey(() => Status)
    @Column({type: DataType.INTEGER})
    statusId: number;

    @ForeignKey(() => Payment)
    @Column({ type: DataType.UUID, allowNull: true })
    paymentId: string;

    @BelongsTo(() => Status)
    status: Status

    @BelongsTo(() => Project)
    project: Project;

    @HasMany(() => Task)
    tasks: Task[];

    @HasOne(() => Payment)
    payment: Payment;
}
