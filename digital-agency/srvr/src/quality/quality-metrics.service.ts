import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QualityMetric } from './models';
import { CreateQualityMetricDto, UpdateQualityMetricDto } from './dto';
import { Op } from 'sequelize';

@Injectable()
export class QualityMetricsService {
  constructor(
    @InjectModel(QualityMetric)
    private qualityMetricModel: typeof QualityMetric,
  ) {}

  async create(createQualityMetricDto: CreateQualityMetricDto): Promise<QualityMetric> {
    return this.qualityMetricModel.create({ ...createQualityMetricDto });
  }

  async findAll(): Promise<QualityMetric[]> {
    return this.qualityMetricModel.findAll();
  }

  async findOne(id: number): Promise<QualityMetric> {
    return this.qualityMetricModel.findByPk(id);
  }

  async update(id: number, updateQualityMetricDto: UpdateQualityMetricDto): Promise<[number, QualityMetric[]]> {
    return this.qualityMetricModel.update({ ...updateQualityMetricDto }, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.qualityMetricModel.destroy({ where: { id } });
  }

  async getMetricsByCategory(category: string): Promise<QualityMetric[]> {
    return this.qualityMetricModel.findAll({ where: { category } });
  }

  async getMetricsByDateRange(startDate: Date, endDate: Date): Promise<QualityMetric[]> {
    return this.qualityMetricModel.findAll({
      where: {
        measurementDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }

  async calculateServiceLevelAgreement(metrics: QualityMetric[]): Promise<{
    sla: number;
    compliance: number;
  }> {
    const totalMetrics = metrics.length;
    const metMetrics = metrics.filter(m => m.status === 'Met').length;
    
    return {
      sla: (metMetrics / totalMetrics) * 100,
      compliance: (metMetrics / totalMetrics) * 100,
    };
  }
} 