import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ServerMetrics } from './models/server-metrics.model';
import { Op } from 'sequelize';

@Injectable()
export class ServerMetricsService {
  constructor(
    @InjectModel(ServerMetrics)
    private serverMetricsModel: typeof ServerMetrics,
  ) {}

  async create(metrics: Partial<ServerMetrics>): Promise<ServerMetrics> {
    return this.serverMetricsModel.create(metrics);
  }

  async findAll(): Promise<ServerMetrics[]> {
    return this.serverMetricsModel.findAll();
  }

  async findAnomalies(): Promise<ServerMetrics[]> {
    return this.serverMetricsModel.findAll({
      where: {
        isAnomaly: true,
      },
    });
  }

  async getMetricsByTimeRange(startDate: Date, endDate: Date): Promise<ServerMetrics[]> {
    return this.serverMetricsModel.findAll({
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }

  async detectAnomalies(metrics: ServerMetrics[]): Promise<ServerMetrics[]> {
    // Calculate mean and standard deviation for each metric
    const cpuMean = metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length;
    const cpuStd = Math.sqrt(
      metrics.reduce((sum, m) => sum + Math.pow(m.cpuUsage - cpuMean, 2), 0) / metrics.length
    );

    const memoryMean = metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length;
    const memoryStd = Math.sqrt(
      metrics.reduce((sum, m) => sum + Math.pow(m.memoryUsage - memoryMean, 2), 0) / metrics.length
    );

    const anomalies = metrics.filter(metric => {
      const isCpuAnomaly = Math.abs(metric.cpuUsage - cpuMean) > 2 * cpuStd;
      const isMemoryAnomaly = Math.abs(metric.memoryUsage - memoryMean) > 2 * memoryStd;
      return isCpuAnomaly || isMemoryAnomaly;
    });

    // Update anomaly flags in database
    await Promise.all(
      anomalies.map(anomaly =>
        this.serverMetricsModel.update(
          { isAnomaly: true },
          { where: { id: anomaly.id } }
        )
      )
    );

    return anomalies;
  }

  async predictLoad(metrics: ServerMetrics[]): Promise<number[]> {
    // Simple moving average prediction
    const windowSize = 5;
    const predictions = metrics.map((metric, index) => {
      if (index < windowSize) {
        return metric.activeConnections;
      }
      
      // Calculate moving average
      const window = metrics.slice(index - windowSize, index);
      const avgConnections = window.reduce((sum, m) => sum + m.activeConnections, 0) / windowSize;
      
      // Add trend component
      const trend = (metric.activeConnections - metrics[index - 1].activeConnections) * 0.3;
      
      return avgConnections + trend;
    });

    // Update predictions in database
    await Promise.all(
      metrics.map((metric, index) =>
        this.serverMetricsModel.update(
          { predictedLoad: predictions[index] },
          { where: { id: metric.id } }
        )
      )
    );

    return predictions;
  }

  async trainModel(metrics: ServerMetrics[]): Promise<void> {
    // In this simplified version, we just update the predictions
    await this.predictLoad(metrics);
  }
} 