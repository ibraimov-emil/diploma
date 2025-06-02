import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'quality_metrics' })
export class QualityMetric extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category: string; // Service Level, Availability, Performance, etc.

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  targetValue: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  actualValue: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  measurementDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string; // Met, Not Met, Warning

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  additionalData: Record<string, any>;
} 