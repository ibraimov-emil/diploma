import { Controller, Post } from '@nestjs/common';
import { QualitySeedService } from './seeders/quality-seed.service';

@Controller('quality-seed')
export class SeedController {
  constructor(private readonly qualitySeedService: QualitySeedService) {}

  @Post()
  seed() {
    return this.qualitySeedService.seed();
  }
} 