import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QualityMetricsService } from './quality-metrics.service';
import { QualityMetricsController } from './quality-metrics.controller';
import { QualityMetric } from './models/quality-metric.model';
import { ExperimentalResearchService } from './experimental-research.service';
import { ExperimentalResearchController } from './experimental-research.controller';
import { ExperimentalResearch } from './models/experimental-research.model';
import { ServerMetricsService } from './server-metrics.service';
import { ServerMetricsController } from './server-metrics.controller';
import { ServerMetrics } from './models/server-metrics.model';
import { QualitySeedService } from './seeders/quality-seed.service';
import { Incident } from './models/incident.model';
import { AuditLog } from './models/audit-log.model';
import { ServiceMetrics } from './models/service-metrics.model';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { ServiceMetricsService } from './service-metrics.service';
import { ServiceMetricsController } from './service-metrics.controller';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { SeedController } from './seed.controller';
import { User } from '../auth/models/user.model';
import * as client from 'prom-client';

// Create a Registry which registers the metrics
const register = new client.Registry();
// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'digital-agency-quality'
});

@Module({
  imports: [
    SequelizeModule.forFeature([
      QualityMetric, 
      ExperimentalResearch, 
      ServerMetrics,
      Incident,
      AuditLog,
      ServiceMetrics,
      User
    ]),
  ],
  controllers: [
    QualityMetricsController, 
    ExperimentalResearchController, 
    ServerMetricsController,
    IncidentsController,
    ServiceMetricsController,
    AuditLogsController,
    SeedController
  ],
  providers: [
    QualityMetricsService, 
    ExperimentalResearchService, 
    ServerMetricsService,
    QualitySeedService,
    IncidentsService,
    ServiceMetricsService,
    AuditLogsService,
    {
      provide: 'PROMETHEUS_REGISTRY',
      useValue: register
    }
  ],
  exports: [
    QualityMetricsService, 
    ExperimentalResearchService, 
    ServerMetricsService,
    QualitySeedService,
    IncidentsService,
    ServiceMetricsService,
    AuditLogsService
  ],
})
export class QualityModule {} 