import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { Incident } from './models/incident.model';
import { InvalidIdException } from '../exceptions/invalid-id.exception';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Define DTOs for request validation
class CreateIncidentDto {
  title?: string;
  description?: string;
  severity?: string;
  userId?: number;
  status?: string;
  registrationTime?: Date;
  relatedEntityType?: string;
  relatedEntityId?: number;
  requestTitle?: string;
  additionalInfo?: string;
  metadata?: string;
}

class UpdateIncidentStatusDto {
  status: string;
  resolutionNotes?: string;
}

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all incidents' })
  @ApiResponse({ status: 200, description: 'Returns all incidents' })
  findAll() {
    return this.incidentsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get incident statistics' })
  @ApiResponse({ status: 200, description: 'Returns incident statistics' })
  getIncidentStats() {
    return this.incidentsService.getIncidentStats();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get incidents by status' })
  @ApiResponse({ status: 200, description: 'Returns incidents filtered by status' })
  findByStatus(@Param('status') status: string) {
    return this.incidentsService.findByStatus(status);
  }

  @Get('severity/:severity')
  @ApiOperation({ summary: 'Get incidents by severity' })
  @ApiResponse({ status: 200, description: 'Returns incidents filtered by severity' })
  findBySeverity(@Param('severity') severity: string) {
    return this.incidentsService.findBySeverity(severity);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get incidents by date range' })
  @ApiResponse({ status: 200, description: 'Returns incidents filtered by date range' })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.incidentsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new user-reported incident' })
  @ApiResponse({ status: 201, description: 'Incident created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createIncidentDto: CreateIncidentDto, @Req() req) {
    console.log('Received incident data:', createIncidentDto);
    
    // Only set default values if they are missing
    const sanitizedData = {
      ...createIncidentDto,
      title: createIncidentDto.title || 'Без заголовка',
      description: createIncidentDto.description || 'Без описания',
      severity: createIncidentDto.severity || 'medium',
      userId: req.user?.id || createIncidentDto.userId || 1,
      status: createIncidentDto.status || 'open',
      registrationTime: createIncidentDto.registrationTime || new Date()
    };

    // Handle metadata
    if (createIncidentDto.metadata) {
      // Keep original metadata if it exists
      sanitizedData.metadata = createIncidentDto.metadata;
    } 
    else if (createIncidentDto.relatedEntityType && createIncidentDto.relatedEntityId) {
      sanitizedData.metadata = JSON.stringify({
        relatedEntityType: createIncidentDto.relatedEntityType,
        relatedEntityId: createIncidentDto.relatedEntityId,
        requestTitle: createIncidentDto.requestTitle || '',
        additionalInfo: createIncidentDto.additionalInfo || ''
      });
    }

    console.log('Sanitized incident data:', sanitizedData);
    return this.incidentsService.createUserIncident(sanitizedData);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update incident status' })
  @ApiResponse({ status: 200, description: 'Incident status updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateIncidentStatusDto,
  ) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.incidentsService.updateIncidentStatus(
      idNum,
      updateStatusDto.status,
      updateStatusDto.resolutionNotes
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident by ID' })
  @ApiResponse({ status: 200, description: 'Returns the incident with the specified ID' })
  @ApiResponse({ status: 400, description: 'Invalid ID' })
  findOne(@Param('id') id: string) {
    // Parse id as number and check if it's valid
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.incidentsService.findOne(idNum);
  }
} 