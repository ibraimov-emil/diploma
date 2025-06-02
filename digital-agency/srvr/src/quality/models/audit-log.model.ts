import { Model, DataType, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/models/user.model';

export interface AuditLogCreationAttrs {
    action: string;
    entityType: string;
    entityId: number;
    userId: number;
    details: string;
    timestamp?: Date;
}

@Table({ tableName: 'audit_logs' })
export class AuditLog extends Model<AuditLog, AuditLogCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'create', description: 'Action performed (create/update/delete)' })
    @Column({ type: DataType.STRING, allowNull: false })
    action: string;

    @ApiProperty({ example: 'incident', description: 'Type of entity affected' })
    @Column({ type: DataType.STRING, allowNull: false })
    entityType: string;

    @ApiProperty({ example: 1, description: 'ID of the affected entity' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    entityId: number;

    @ApiProperty({ example: 1, description: 'User ID who performed the action' })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ApiProperty({ example: 'Created new incident', description: 'Detailed description of the action' })
    @Column({ type: DataType.TEXT, allowNull: false })
    details: string;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Action timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    timestamp: Date;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Record creation timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    createdAt: Date;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Record update timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    updatedAt: Date;
} 