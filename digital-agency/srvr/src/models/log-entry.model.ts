import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LogEntry extends Document {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true, enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'] })
  level: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  source: string;

  @Prop()
  userId: string;

  @Prop()
  requestId: string;

  @Prop()
  metadata: Record<string, any>;

  @Prop()
  stackTrace: string;

  @Prop()
  duration: number;
}

export const LogEntrySchema = SchemaFactory.createForClass(LogEntry); 