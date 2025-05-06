import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  SequelizeHealthIndicator,
  HealthCheckResult,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { MonitoringService } from './monitoring.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import * as os from 'os';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private db: SequelizeHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private monitoringService: MonitoringService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check the health of the application' })
  async check(): Promise<HealthCheckResult> {
    try {
      const startTime = Date.now();
      
      // Get a proper disk path for the current OS
      const diskPath = os.platform() === 'win32' 
        ? 'C:\\' // Windows - use C drive
        : '/';    // Unix-like systems - use root
      
      const result = await this.health.check([
        async () => {
          try {
            return await this.db.pingCheck('database', { timeout: 1500 });
          } catch (error) {
            this.logger.error(`Database health check failed: ${error.message}`);
            return {
              database: {
                status: 'down',
                message: error.message
              }
            };
          }
        },
        async () => {
          try {
            return await this.memory.checkHeap('memory_heap', 250 * 1024 * 1024);
          } catch (error) {
            this.logger.error(`Memory health check failed: ${error.message}`);
            return {
              memory_heap: {
                status: 'down',
                message: error.message
              }
            };
          }
        },
        async () => {
          try {
            return await this.disk.checkStorage('disk', { path: diskPath, thresholdPercent: 0.9 });
          } catch (error) {
            this.logger.error(`Disk health check failed: ${error.message}`);
            return {
              disk: {
                status: 'down',
                message: error.message
              }
            };
          }
        },
      ]);
      
      const responseTime = Date.now() - startTime;
      
      // Ensure result.details.database exists
      const databaseStatus = result.details.database?.status || 'down';
      
      // Save the health check result
      await this.monitoringService.saveHealthCheck(
        result.status,
        responseTime,
        databaseStatus,
        result.details
      );
      
      return result;
    } catch (error) {
      this.logger.error(`Health check failed with error: ${error.message}`);
      
      // Still save the health check but with failed status
      try {
        await this.monitoringService.saveHealthCheck(
          'down',
          0,
          'down',
          { error: error.message }
        );
      } catch (saveError) {
        this.logger.error(`Failed to save health check failure: ${saveError.message}`);
      }
      
      throw new HttpException(
        'Health check failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 