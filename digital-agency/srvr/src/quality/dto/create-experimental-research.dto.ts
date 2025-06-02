import { IsString, IsDate, IsObject, IsArray, IsOptional } from 'class-validator';

export class CreateExperimentalResearchDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  status: string;

  @IsObject()
  objectives: {
    primary: string[];
    secondary: string[];
  };

  @IsObject()
  methodology: {
    approach: string;
    tools: string[];
    dataCollectionMethods: string[];
    analysisMethods: string[];
  };

  @IsObject()
  @IsOptional()
  results?: {
    findings: string[];
    metrics: Record<string, number>;
    conclusions: string[];
  };

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  recommendations?: string[];

  @IsString()
  @IsOptional()
  responsiblePerson?: string;
} 