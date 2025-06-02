import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExperimentalResearchService } from './experimental-research.service';
import { CreateExperimentalResearchDto, UpdateExperimentalResearchDto } from './dto';
import { InvalidIdException } from '../exceptions/invalid-id.exception';

@Controller('experimental-research')
export class ExperimentalResearchController {
  constructor(private readonly experimentalResearchService: ExperimentalResearchService) {}

  @Post()
  create(@Body() createDto: CreateExperimentalResearchDto) {
    return this.experimentalResearchService.create(createDto);
  }

  @Get()
  findAll() {
    return this.experimentalResearchService.findAll();
  }

  @Get('active')
  getActiveResearch() {
    return this.experimentalResearchService.getActiveResearch();
  }

  @Get('completed')
  getCompletedResearch() {
    return this.experimentalResearchService.getCompletedResearch();
  }

  @Get('date-range')
  getResearchByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.experimentalResearchService.getResearchByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.experimentalResearchService.findOne(idNum);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateExperimentalResearchDto) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.experimentalResearchService.update(idNum, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.experimentalResearchService.remove(idNum);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.experimentalResearchService.updateResearchStatus(idNum, status);
  }
} 