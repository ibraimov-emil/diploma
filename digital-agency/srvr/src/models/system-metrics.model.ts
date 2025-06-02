import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SystemMetrics extends Document {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  cpuUsage: number;

  @Prop({ required: true })
  memoryUsage: number;

  @Prop({ required: true })
  requestCount: number;

  @Prop({ required: true })
  responseTime: number;

  @Prop({ required: true })
  errorRate: number;

  @Prop()
  activeUsers: number;

  @Prop()
  networkTraffic: number;

  @Prop()
  diskUsage: number;
}

export const SystemMetricsSchema = SchemaFactory.createForClass(SystemMetrics); 