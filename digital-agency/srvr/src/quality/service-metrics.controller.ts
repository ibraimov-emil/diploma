import { Controller, Get, Query } from '@nestjs/common';
import { ServiceMetricsService } from './service-metrics.service';

@Controller('service-metrics')
export class ServiceMetricsController {
  constructor(private readonly serviceMetricsService: ServiceMetricsService) {}

  @Get()
  findAll() {
    return this.serviceMetricsService.findAll();
  }

  @Get('latest')
  getLatestMetrics() {
    return this.serviceMetricsService.getLatestMetrics();
  }

  @Get('date-range')
  getMetricsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.serviceMetricsService.getMetricsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('summary')
  getMetricsSummary() {
    return this.serviceMetricsService.getMetricsSummary();
  }
} 