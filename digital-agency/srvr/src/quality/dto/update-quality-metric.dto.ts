import { PartialType } from '@nestjs/mapped-types';
import { CreateQualityMetricDto } from './create-quality-metric.dto';

export class UpdateQualityMetricDto extends PartialType(CreateQualityMetricDto) {} 