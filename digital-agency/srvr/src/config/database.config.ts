import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize/types';

const configService = new ConfigService();

export const databaseConfig = {
  dialect: 'postgres' as Dialect,
  host: configService.get('DB_HOST') || 'localhost',
  port: Number(configService.get('DB_PORT')) || 5432,
  username: configService.get('DB_USERNAME') || 'postgres',
  password: configService.get('DB_PASSWORD') || 'admin',
  database: configService.get('DB_NAME') || 'digital-agency',
  autoLoadModels: true,
  synchronize: true,
  logging: false,
}; 