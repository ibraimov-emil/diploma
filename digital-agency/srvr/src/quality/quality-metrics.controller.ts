import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QualityMetricsService } from './quality-metrics.service';
import { CreateQualityMetricDto, UpdateQualityMetricDto } from './dto';
import { InvalidIdException } from '../exceptions/invalid-id.exception';

@Controller('quality-metrics')
export class QualityMetricsController {
  constructor(private readonly qualityMetricsService: QualityMetricsService) {}

  @Post()
  create(@Body() createQualityMetricDto: CreateQualityMetricDto) {
    return this.qualityMetricsService.create(createQualityMetricDto);
  }

  @Get()
  findAll() {
    return this.qualityMetricsService.findAll();
  }

  @Get('category/:category')
  getMetricsByCategory(@Param('category') category: string) {
    return this.qualityMetricsService.getMetricsByCategory(category);
  }

  @Get('date-range')
  getMetricsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.qualityMetricsService.getMetricsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('sla/calculate')
  calculateSLA() {
    return this.qualityMetricsService.findAll().then(metrics =>
      this.qualityMetricsService.calculateServiceLevelAgreement(metrics),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.qualityMetricsService.findOne(idNum);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQualityMetricDto: UpdateQualityMetricDto) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.qualityMetricsService.update(idNum, updateQualityMetricDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      throw new InvalidIdException(id);
    }
    return this.qualityMetricsService.remove(idNum);
  }
} 