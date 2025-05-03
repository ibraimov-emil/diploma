import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { Incident } from './models/incident.model';
import { InvalidIdException } from '../exceptions/invalid-id.exception';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  findAll() {
    return this.incidentsService.findAll();
  }

  @Get('stats')
  getIncidentStats() {
    return this.incidentsService.getIncidentStats();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.incidentsService.findByStatus(status);
  }

  @Get('severity/:severity')
  findBySeverity(@Param('severity') severity: string) {
    return this.incidentsService.findBySeverity(severity);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.incidentsService.findByDateRange(
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
    return this.incidentsService.findOne(idNum);
  }
} 