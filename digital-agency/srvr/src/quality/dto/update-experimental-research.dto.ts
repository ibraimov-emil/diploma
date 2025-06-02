import { PartialType } from '@nestjs/mapped-types';
import { CreateExperimentalResearchDto } from './create-experimental-research.dto';

export class UpdateExperimentalResearchDto extends PartialType(CreateExperimentalResearchDto) {} 