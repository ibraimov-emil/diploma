import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ServerMetricsService } from './server-metrics.service';
import { ServerMetrics } from './models/server-metrics.model';

@Controller('server-metrics')
export class ServerMetricsController {
  constructor(private readonly serverMetricsService: ServerMetricsService) {}

  @Post()
  create(@Body() metrics: Partial<ServerMetrics>) {
    return this.serverMetricsService.create(metrics);
  }

  @Get()
  findAll() {
    return this.serverMetricsService.findAll();
  }

  @Get('anomalies')
  findAnomalies() {
    return this.serverMetricsService.findAnomalies();
  }

  @Get('time-range')
  getMetricsByTimeRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.serverMetricsService.getMetricsByTimeRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post('detect-anomalies')
  async detectAnomalies() {
    const metrics = await this.serverMetricsService.findAll();
    return this.serverMetricsService.detectAnomalies(metrics);
  }

  @Post('predict-load')
  async predictLoad() {
    const metrics = await this.serverMetricsService.findAll();
    return this.serverMetricsService.predictLoad(metrics);
  }

  @Post('train-model')
  async trainModel() {
    const metrics = await this.serverMetricsService.findAll();
    return this.serverMetricsService.trainModel(metrics);
  }
} 