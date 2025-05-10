import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum IncidentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IncidentStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum IncidentCategory {
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  PERFORMANCE = 'PERFORMANCE',
  SECURITY = 'SECURITY',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  APPLICATION = 'APPLICATION',
  OTHER = 'OTHER'
}

@Schema()
export class Incident extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: IncidentPriority, default: IncidentPriority.MEDIUM })
  priority: IncidentPriority;

  @Prop({ required: true, enum: IncidentStatus, default: IncidentStatus.NEW })
  status: IncidentStatus;

  @Prop({ required: true, enum: IncidentCategory })
  category: IncidentCategory;

  @Prop({ required: true })
  reportedBy: string;

  @Prop()
  assignedTo: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  resolvedAt: Date;

  @Prop()
  closedAt: Date;

  @Prop()
  impact: string;

  @Prop()
  urgency: string;

  @Prop()
  resolution: string;

  @Prop()
  rootCause: string;

  @Prop()
  affectedServices: string[];

  @Prop()
  relatedIncidents: string[];

  @Prop()
  attachments: string[];

  @Prop()
  comments: {
    text: string;
    author: string;
    timestamp: Date;
  }[];

  @Prop()
  slaBreach: boolean;

  @Prop()
  resolutionTime: number; // в минутах

  @Prop()
  firstResponseTime: number; // в минутах
}

export const IncidentSchema = SchemaFactory.createForClass(Incident); 