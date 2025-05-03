import { Model, DataType, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/models/user.model';

export interface IncidentCreationAttrs {
    title: string;
    description: string;
    severity: string;
    status: string;
    userId: number;
    registrationTime?: Date;
    resolutionTime?: Date;
}

@Table({ tableName: 'incidents' })
export class Incident extends Model<Incident, IncidentCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 'Service outage', description: 'Incident title' })
    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @ApiProperty({ example: 'Service unavailable for 30 minutes', description: 'Incident description' })
    @Column({ type: DataType.TEXT, allowNull: false })
    description: string;

    @ApiProperty({ example: 'high', description: 'Incident severity (high/medium/low)' })
    @Column({ type: DataType.STRING, allowNull: false })
    severity: string;

    @ApiProperty({ example: 'open', description: 'Incident status (open/resolved)' })
    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'open' })
    status: string;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Incident registration time' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    registrationTime: Date;

    @ApiProperty({ example: '2024-03-05T11:00:00Z', description: 'Incident resolution time', required: false })
    @Column({ type: DataType.DATE, allowNull: true })
    resolutionTime: Date;

    @ApiProperty({ example: 1, description: 'User ID who created the incident' })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Record creation timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    createdAt: Date;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Record update timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    updatedAt: Date;
} 