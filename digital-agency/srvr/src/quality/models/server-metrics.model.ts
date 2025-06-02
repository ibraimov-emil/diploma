import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'server_metrics' })
export class ServerMetrics extends Model<ServerMetrics> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timestamp: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  cpuUsage: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  memoryUsage: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  diskUsage: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  activeConnections: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  responseTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  errorCount: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  logData: {
    level: string;
    message: string;
    context: Record<string, any>;
  }[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isAnomaly: boolean;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  predictedLoad: number;
} 