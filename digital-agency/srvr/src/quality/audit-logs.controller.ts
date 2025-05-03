import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { InvalidIdException } from '../exceptions/invalid-id.exception';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('stats')
  getAuditStats() {
    return this.auditLogsService.getAuditStats();
  }

  @Get('entity-type/:entityType')
  findByEntityType(@Param('entityType') entityType: string) {
    return this.auditLogsService.findByEntityType(entityType);
  }

  @Get('action/:action')
  findByAction(@Param('action') action: string) {
    return this.auditLogsService.findByAction(action);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.auditLogsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Parse id as number and check if it's valid
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.auditLogsService.findOne(idNum);
  }
} 