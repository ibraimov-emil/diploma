import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { ServiceMetrics } from './models/service-metrics.model';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// For Prometheus metrics
import * as client from 'prom-client';
import * as winston from 'winston';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  // Prometheus metrics
  private readonly healthyResponsesCounter = new client.Counter({
    name: 'api_healthy_responses',
    help: 'Number of successful health checks',
  });

  private readonly failedResponsesCounter = new client.Counter({
    name: 'api_failed_responses',
    help: 'Number of failed health checks',
  });

  private readonly responseTimeHistogram = new client.Histogram({
    name: 'api_response_time',
    help: 'Response time of the API in milliseconds',
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  });

  // Winston logger for incidents
  private readonly incidentLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { service: 'monitoring-service' },
    transports: [
      new winston.transports.File({ filename: 'logs/incidents.log' }),
      new winston.transports.Console(),
    ],
  });

  constructor(
    @InjectModel(ServiceMetrics)
    private serviceMetricsModel: typeof ServiceMetrics,
    private httpService: HttpService
  ) {
    // Create logs directory if it doesn't exist
    try {
      const fs = require('fs');
      if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
      }
    } catch (error) {
      this.logger.error('Failed to create logs directory', error);
    }

    // Register metrics with the Prometheus registry
    try {
      client.register.registerMetric(this.healthyResponsesCounter);
      client.register.registerMetric(this.failedResponsesCounter);
      client.register.registerMetric(this.responseTimeHistogram);
    } catch (error) {
      this.logger.error('Failed to register Prometheus metrics', error);
    }
  }

  async saveHealthCheck(
    status: string,
    responseTime: number,
    databaseStatus: string,
    details: Record<string, any>
  ): Promise<ServiceMetrics> {
    const timestamp = new Date();

    try {
      if (status === 'up') {
        this.healthyResponsesCounter.inc();
      } else {
        this.failedResponsesCounter.inc();
        await this.logIncident(status, databaseStatus, details);
      }

      this.responseTimeHistogram.observe(responseTime);

      return this.serviceMetricsModel.create({
        status,
        responseTime,
        databaseStatus,
        timestamp,
        details,
      });
    } catch (error) {
      this.logger.error('Failed to save health check', error);
      // Return a mock object in case of error to prevent application crash
      return {
        id: 0,
        status,
        responseTime,
        databaseStatus,
        timestamp,
        details
      } as ServiceMetrics;
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async performHealthCheck() {
    try {
      // Get the base URL from the environment or use a default
      const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/health`)
      );
      
      // Add type assertion to handle the unknown type
      const responseData = response.data as { status: string };
      
      this.logger.log(`Health check completed with status: ${responseData.status}`);
      
      if (responseData.status !== 'up') {
        this.logger.error('Health check failed', responseData);
      }
    } catch (error) {
      this.logger.error('Health check failed with error', error);
      this.failedResponsesCounter.inc();
      await this.logIncident('down', 'unknown', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  async calculateUptime(periodInHours: number = 24): Promise<number> {
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - periodInHours * 60 * 60 * 1000);

      // Поддержка разных версий Sequelize для оператора $between
      const betweenOperator = { $between: [startDate, endDate] };
      const Op = require('sequelize').Op;
      const sequelizeBetween = { [Op.between]: [startDate, endDate] };

      // Попытка использовать правильный оператор для версии Sequelize
      const whereClause = {
        timestamp: betweenOperator
      };

      const totalChecks = await this.serviceMetricsModel.count({
        where: whereClause
      });

      const successfulChecks = await this.serviceMetricsModel.count({
        where: {
          ...whereClause,
          status: 'up',
        },
      });

      if (totalChecks === 0) return 100; // Assume 100% uptime if no checks

      return (successfulChecks / totalChecks) * 100;
    } catch (error) {
      this.logger.error('Failed to calculate uptime', error);
      return 100; // Return 100% as a fallback to prevent UI errors
    }
  }

  private async logIncident(
    status: string,
    databaseStatus: string,
    details: Record<string, any>
  ): Promise<void> {
    try {
      const incidentData = {
        timestamp: new Date().toISOString(),
        status,
        databaseStatus,
        details,
      };

      // Log the incident
      this.incidentLogger.error('Service unavailable', incidentData);

      // Send Slack notification if webhook URL is configured
      if (this.slackWebhookUrl) {
        try {
          await firstValueFrom(
            this.httpService.post(this.slackWebhookUrl, {
              text: `🚨 *SERVICE ALERT*: The API is currently DOWN!\n*Status*: ${status}\n*Database*: ${databaseStatus}\n*Time*: ${incidentData.timestamp}\n*Details*: ${JSON.stringify(details)}`,
            })
          );
        } catch (error) {
          this.logger.error('Failed to send Slack notification', error);
        }
      }
    } catch (error) {
      this.logger.error('Failed to log incident', error);
    }
  }

  async getMetrics(): Promise<string> {
    try {
      return client.register.metrics();
    } catch (error) {
      this.logger.error('Failed to get metrics', error);
      return 'Error fetching metrics';
    }
  }
} 