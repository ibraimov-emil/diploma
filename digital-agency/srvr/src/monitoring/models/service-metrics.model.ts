import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface ServiceMetricsCreationAttrs {
  status: string;
  responseTime: number;
  databaseStatus: string;
  timestamp: Date;
  details?: Record<string, any>;
}

@Table({ tableName: 'service_metrics' })
export class ServiceMetrics extends Model<ServiceMetrics, ServiceMetricsCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'UP', description: 'Service status (UP/DOWN)' })
  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @ApiProperty({ example: 200, description: 'Response time in milliseconds' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  responseTime: number;

  @ApiProperty({ example: 'UP', description: 'Database status (UP/DOWN)' })
  @Column({ type: DataType.STRING, allowNull: false })
  databaseStatus: string;

  @ApiProperty({ example: '2023-05-03T10:00:00.000Z', description: 'Timestamp of the health check' })
  @Column({ type: DataType.DATE, allowNull: false })
  timestamp: Date;

  @ApiProperty({ example: {}, description: 'Additional details about the health check' })
  @Column({ type: DataType.JSONB, allowNull: true })
  details: Record<string, any>;
} 