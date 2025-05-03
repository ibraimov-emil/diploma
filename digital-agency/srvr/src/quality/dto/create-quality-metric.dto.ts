import { IsString, IsNumber, IsDate, IsOptional, IsObject } from 'class-validator';

export class CreateQualityMetricDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  targetValue: number;

  @IsNumber()
  actualValue: number;

  @IsDate()
  measurementDate: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  status: string;

  @IsObject()
  @IsOptional()
  additionalData?: Record<string, any>;
} 