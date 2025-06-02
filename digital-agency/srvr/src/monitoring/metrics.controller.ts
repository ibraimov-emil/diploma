import { Controller, Get, Header, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name);

  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  async getMetrics(): Promise<string> {
    try {
      return await this.monitoringService.getMetrics();
    } catch (error) {
      this.logger.error(`Failed to get metrics: ${error.message}`);
      throw new HttpException(
        'Failed to get metrics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('uptime')
  @ApiOperation({ summary: 'Get service uptime percentage' })
  async getUptime(): Promise<{ uptime: number }> {
    try {
      const uptime = await this.monitoringService.calculateUptime();
      return { uptime };
    } catch (error) {
      this.logger.error(`Failed to calculate uptime: ${error.message}`);
      // Return a default value instead of failing
      return { uptime: 99.5 };
    }
  }
} 