import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'experimental_research' })
export class ExperimentalResearch extends Model {
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
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string; // Planned, In Progress, Completed, Cancelled

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  objectives: {
    primary: string[];
    secondary: string[];
  };

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  methodology: {
    approach: string;
    tools: string[];
    dataCollectionMethods: string[];
    analysisMethods: string[];
  };

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  results: {
    findings: string[];
    metrics: Record<string, number>;
    conclusions: string[];
  };

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  recommendations: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  responsiblePerson: string;
} 