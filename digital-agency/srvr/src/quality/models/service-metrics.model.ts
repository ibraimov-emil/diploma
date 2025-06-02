import { Model, DataType, Table, Column } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

export interface ServiceMetricsCreationAttrs {
    uptime: number;
    mttr: number;
    mtbf: number;
    responseTime: number;
    errorRate: number;
    requestCount: number;
    timestamp?: Date;
}

@Table({ tableName: 'quality_service_metrics' })
export class ServiceMetrics extends Model<ServiceMetrics, ServiceMetricsCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Unique identifier' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: 99.9, description: 'Service uptime percentage' })
    @Column({ type: DataType.FLOAT, allowNull: false })
    uptime: number;

    @ApiProperty({ example: 30, description: 'Mean Time To Recovery in minutes' })
    @Column({ type: DataType.FLOAT, allowNull: false })
    mttr: number;

    @ApiProperty({ example: 1440, description: 'Mean Time Between Failures in minutes' })
    @Column({ type: DataType.FLOAT, allowNull: false })
    mtbf: number;

    @ApiProperty({ example: 200, description: 'Average response time in milliseconds' })
    @Column({ type: DataType.FLOAT, allowNull: false })
    responseTime: number;

    @ApiProperty({ example: 0.1, description: 'Error rate percentage' })
    @Column({ type: DataType.FLOAT, allowNull: false })
    errorRate: number;

    @ApiProperty({ example: 1000, description: 'Total number of requests' })
    @Column({ type: DataType.INTEGER, allowNull: false })
    requestCount: number;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Metrics timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    timestamp: Date;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Record creation timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    createdAt: Date;

    @ApiProperty({ example: '2024-03-05T10:00:00Z', description: 'Record update timestamp' })
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    updatedAt: Date;
} 