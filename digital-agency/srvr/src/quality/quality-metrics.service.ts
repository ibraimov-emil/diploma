import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QualityMetric } from './models';
import { ServiceMetrics } from './models/service-metrics.model';
import { Incident } from './models/incident.model';
import { CreateQualityMetricDto, UpdateQualityMetricDto } from './dto';
import { Op } from 'sequelize';
import * as client from 'prom-client';

@Injectable()
export class QualityMetricsService {
  private readonly logger = new Logger(QualityMetricsService.name);
  private serviceUptimeGauge: client.Gauge;
  private mttrGauge: client.Gauge;
  private mtbfGauge: client.Gauge;
  private errorRateGauge: client.Gauge;
  private incidentCountGauge: client.Gauge;

  constructor(
    @InjectModel(QualityMetric)
    private qualityMetricModel: typeof QualityMetric,
    @InjectModel(ServiceMetrics)
    private serviceMetricsModel: typeof ServiceMetrics,
    @InjectModel(Incident)
    private incidentModel: typeof Incident,
  ) {
    // Initialize Prometheus metrics
    this.initPrometheusMetrics();
    
    // Start metrics collection
    this.startMetricsCollection();
  }

  private initPrometheusMetrics() {
    // Create Prometheus metrics
    this.serviceUptimeGauge = new client.Gauge({
      name: 'service_uptime',
      help: 'Service uptime percentage',
    });

    this.mttrGauge = new client.Gauge({
      name: 'service_mttr',
      help: 'Mean Time To Recovery in minutes',
    });

    this.mtbfGauge = new client.Gauge({
      name: 'service_mtbf',
      help: 'Mean Time Between Failures in minutes',
    });

    this.errorRateGauge = new client.Gauge({
      name: 'service_error_rate',
      help: 'Service error rate percentage',
    });

    this.incidentCountGauge = new client.Gauge({
      name: 'incident_count',
      help: 'Count of open incidents',
    });
  }

  private async startMetricsCollection() {
    // Update metrics immediately
    await this.updatePrometheusMetrics();
    
    // Then update every 60 seconds
    setInterval(async () => {
      await this.updatePrometheusMetrics();
    }, 60000);
  }

  private async updatePrometheusMetrics() {
    try {
      // Get latest service metrics
      const latestMetrics = await this.serviceMetricsModel.findOne({
        order: [['timestamp', 'DESC']],
      });

      if (latestMetrics) {
        this.serviceUptimeGauge.set(latestMetrics.uptime);
        this.mttrGauge.set(latestMetrics.mttr);
        this.mtbfGauge.set(latestMetrics.mtbf);
        this.errorRateGauge.set(latestMetrics.errorRate);
      }

      // Count open incidents
      const openIncidentsCount = await this.incidentModel.count({
        where: {
          status: 'open'
        }
      });
      this.incidentCountGauge.set(openIncidentsCount);
      
      this.logger.log('Updated Prometheus metrics');
    } catch (error) {
      this.logger.error(`Error updating metrics: ${error.message}`);
    }
  }

  async getServiceMetrics(): Promise<ServiceMetrics> {
    return this.serviceMetricsModel.findOne({
      order: [['timestamp', 'DESC']],
    });
  }

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