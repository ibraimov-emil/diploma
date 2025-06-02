import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ServiceQualityService } from '../services/service-quality.service';
import { Incident } from '../models/incident.model';
import { ServiceMetrics } from '../models/service-metrics.model';
import { AuditLog } from '../models/audit-log.model';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Service Quality')
@Controller('quality')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QualityController {
    constructor(private readonly serviceQualityService: ServiceQualityService) {}

    @Post('incidents')
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Log a new incident',
        description: 'Creates a new incident record with the provided details'
    })
    @ApiBody({
        type: Incident,
        description: 'Incident details',
        examples: {
            example1: {
                value: {
                    title: 'Service outage',
                    description: 'Service unavailable for 30 minutes',
                    severity: 'high',
                    userId: 1
                }
            }
        }
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Incident logged successfully', 
        type: Incident 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized' 
    })
    @ApiResponse({ 
        status: 403, 
        description: 'Forbidden - Admin role required' 
    })
    async logIncident(@Body() incidentData: Partial<Incident>): Promise<Incident> {
        return this.serviceQualityService.logIncident(incidentData);
    }

    @Post('incidents/:id/resolve')
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Resolve an incident',
        description: 'Marks an incident as resolved and updates the resolution time'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Incident ID',
        example: 1
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Incident resolved successfully', 
        type: Incident 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Incident not found' 
    })
    async resolveIncident(@Param('id') id: string): Promise<Incident> {
        return this.serviceQualityService.resolveIncident(Number(id));
    }

    @Get('metrics')
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Get current service metrics',
        description: 'Retrieves the latest service quality metrics including uptime, MTTR, and MTBF'
    })
    @ApiQuery({
        name: 'timeRange',
        required: false,
        description: 'Time range for metrics (e.g., last 24 hours)',
        example: '24h'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Service metrics retrieved successfully', 
        type: ServiceMetrics 
    })
    async getMetrics(@Query('timeRange') timeRange?: string): Promise<ServiceMetrics> {
        return this.serviceQualityService.calculateMetrics();
    }

    @Get('audit-logs')
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Get audit logs',
        description: 'Retrieves the latest audit logs with pagination'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number',
        example: 1
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        example: 10
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Audit logs retrieved successfully', 
        type: [AuditLog] 
    })
    async getAuditLogs(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<AuditLog[]> {
        return this.serviceQualityService.getAuditLogs();
    }

    @Get('incidents')
    @Roles('admin')
    @ApiOperation({ 
        summary: 'Get all incidents',
        description: 'Retrieves all incidents with optional filtering'
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description: 'Filter by incident status',
        example: 'open'
    })
    @ApiQuery({
        name: 'severity',
        required: false,
        description: 'Filter by incident severity',
        example: 'high'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Incidents retrieved successfully', 
        type: [Incident] 
    })
    async getIncidents(
        @Query('status') status?: string,
        @Query('severity') severity?: string
    ): Promise<Incident[]> {
        return this.serviceQualityService.getIncidents(status, severity);
    }
} 