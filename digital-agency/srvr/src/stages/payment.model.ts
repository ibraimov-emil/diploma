import {BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import {Stage} from "./stage.model";

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment> {
    @ApiProperty({ example: '1', description: 'Unique identifier' })
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ApiProperty({ example: 'Payment for Stage Design', description: 'Payment description' })
    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @ApiProperty({ example: '1000.00', description: 'Payment amount' })
    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    amount: number;

    @ForeignKey(() => Stage)
    @Column({type: DataType.INTEGER})
    stageId: number;

    @BelongsTo(() => Stage)
    stage: Stage;
}