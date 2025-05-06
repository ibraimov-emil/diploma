import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { MonitoringService } from './monitoring.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServiceMetrics } from './models/service-metrics.model';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([ServiceMetrics]),
  ],
  controllers: [HealthController, MetricsController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {} 