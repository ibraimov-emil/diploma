import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceMetrics } from './models/service-metrics.model';
import { Op } from 'sequelize';

@Injectable()
export class ServiceMetricsService {
  constructor(
    @InjectModel(ServiceMetrics)
    private serviceMetricsModel: typeof ServiceMetrics,
  ) {}

  async findAll(): Promise<ServiceMetrics[]> {
    return this.serviceMetricsModel.findAll();
  }

  async getLatestMetrics(): Promise<ServiceMetrics> {
    return this.serviceMetricsModel.findOne({
      order: [['timestamp', 'DESC']],
    });
  }

  async getMetricsByDateRange(startDate: Date, endDate: Date): Promise<ServiceMetrics[]> {
    return this.serviceMetricsModel.findAll({
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['timestamp', 'ASC']],
    });
  }

  async getMetricsSummary() {
    // Get the latest 30 days of metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const metrics = await this.serviceMetricsModel.findAll({
      where: {
        timestamp: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
      order: [['timestamp', 'ASC']],
    });
    
    // Calculate average metrics
    const avgUptime = metrics.reduce((sum, metric) => sum + metric.uptime, 0) / metrics.length;
    const avgMttr = metrics.reduce((sum, metric) => sum + metric.mttr, 0) / metrics.length;
    const avgMtbf = metrics.reduce((sum, metric) => sum + metric.mtbf, 0) / metrics.length;
    const avgResponseTime = metrics.reduce((sum, metric) => sum + metric.responseTime, 0) / metrics.length;
    const avgErrorRate = metrics.reduce((sum, metric) => sum + metric.errorRate, 0) / metrics.length;
    const totalRequests = metrics.reduce((sum, metric) => sum + metric.requestCount, 0);
    
    // Find min/max values
    const minUptime = Math.min(...metrics.map(m => m.uptime));
    const maxResponseTime = Math.max(...metrics.map(m => m.responseTime));
    const maxErrorRate = Math.max(...metrics.map(m => m.errorRate));
    
    return {
      period: '30 days',
      metrics: {
        avgUptime,
        avgMttr,
        avgMtbf,
        avgResponseTime,
        avgErrorRate,
        totalRequests,
        minUptime,
        maxResponseTime,
        maxErrorRate,
      },
      lastUpdated: new Date(),
    };
  }
} 