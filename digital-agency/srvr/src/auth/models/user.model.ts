import { Model, DataType, Table, Column, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Incident } from '../../quality/models/incident.model';
import { AuditLog } from '../../quality/models/audit-log.model';

export interface UserCreationAttrs {
    email: string;
    password: string;
    name: string;
    surname: string;
    role: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @ApiProperty({ example: 'John', description: 'User first name' })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ApiProperty({ example: 'Doe', description: 'User last name' })
    @Column({ type: DataType.STRING, allowNull: false })
    surname: string;

    @ApiProperty({ example: 'admin', description: 'User role' })
    @Column({ type: DataType.STRING, allowNull: false })
    role: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @HasMany(() => Incident)
    incidents: Incident[];

    @HasMany(() => AuditLog)
    auditLogs: AuditLog[];

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Record creation timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    createdAt: Date;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Record update timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    updatedAt: Date;
} 