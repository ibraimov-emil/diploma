import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident, IncidentPriority, IncidentStatus } from '../models/incident.model';

@Injectable()
export class IncidentManagementService {
  constructor(
    @InjectModel('Incident') private incidentModel: Model<Incident>,
  ) {}

  async createIncident(incidentData: Partial<Incident>): Promise<Incident> {
    const incident = new this.incidentModel({
      ...incidentData,
      createdAt: new Date(),
      status: IncidentStatus.NEW
    });
    return incident.save();
  }

  async updateIncident(id: string, updateData: Partial<Incident>): Promise<Incident> {
    return this.incidentModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async resolveIncident(id: string, resolution: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) {
      throw new Error('Incident not found');
    }

    const resolutionTime = this.calculateResolutionTime(incident.createdAt);
    const slaBreach = this.checkSLABreach(resolutionTime, incident.priority);

    return this.incidentModel.findByIdAndUpdate(
      id,
      {
        status: IncidentStatus.RESOLVED,
        resolution,
        resolvedAt: new Date(),
        resolutionTime,
        slaBreach
      },
      { new: true }
    ).exec();
  }

  async closeIncident(id: string): Promise<Incident> {
    return this.incidentModel.findByIdAndUpdate(
      id,
      {
        status: IncidentStatus.CLOSED,
        closedAt: new Date()
      },
      { new: true }
    ).exec();
  }

  async getIncidentsByStatus(status: IncidentStatus): Promise<Incident[]> {
    return this.incidentModel.find({ status }).exec();
  }

  async getIncidentsByPriority(priority: IncidentPriority): Promise<Incident[]> {
    return this.incidentModel.find({ priority }).exec();
  }

  async getIncidentMetrics(): Promise<{
    totalIncidents: number;
    openIncidents: number;
    resolvedIncidents: number;
    averageResolutionTime: number;
    slaCompliance: number;
  }> {
    const totalIncidents = await this.incidentModel.countDocuments();
    const openIncidents = await this.incidentModel.countDocuments({
      status: { $in: [IncidentStatus.NEW, IncidentStatus.IN_PROGRESS, IncidentStatus.ON_HOLD] }
    });
    const resolvedIncidents = await this.incidentModel.countDocuments({
      status: IncidentStatus.RESOLVED
    });

    const incidents = await this.incidentModel.find({
      status: IncidentStatus.RESOLVED
    });

    const averageResolutionTime = incidents.reduce((acc, incident) => {
      return acc + (incident.resolutionTime || 0);
    }, 0) / (resolvedIncidents || 1);

    const slaCompliance = (resolvedIncidents - incidents.filter(i => i.slaBreach).length) / resolvedIncidents * 100;

    return {
      totalIncidents,
      openIncidents,
      resolvedIncidents,
      averageResolutionTime,
      slaCompliance
    };
  }

  private calculateResolutionTime(createdAt: Date): number {
    const now = new Date();
    return Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60)); // в минутах
  }

  private checkSLABreach(resolutionTime: number, priority: IncidentPriority): boolean {
    const slaThresholds = {
      [IncidentPriority.CRITICAL]: 60, // 1 час
      [IncidentPriority.HIGH]: 240, // 4 часа
      [IncidentPriority.MEDIUM]: 480, // 8 часов
      [IncidentPriority.LOW]: 1440 // 24 часа
    };

    return resolutionTime > slaThresholds[priority];
  }

  async getIncidentTrends(): Promise<{
    dailyIncidents: { date: string; count: number }[];
    resolutionTrends: { date: string; averageTime: number }[];
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const incidents = await this.incidentModel.find({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const dailyIncidents = this.groupByDate(incidents, 'createdAt');
    const resolutionTrends = this.calculateResolutionTrends(incidents);

    return {
      dailyIncidents,
      resolutionTrends
    };
  }

  private groupByDate(incidents: Incident[], field: string): { date: string; count: number }[] {
    const grouped = incidents.reduce((acc, incident) => {
      const date = incident[field].toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count: count as number
    }));
  }

  private calculateResolutionTrends(incidents: Incident[]): { date: string; averageTime: number }[] {
    const resolvedIncidents = incidents.filter(i => i.status === IncidentStatus.RESOLVED);
    const groupedByDate = resolvedIncidents.reduce((acc, incident) => {
      const date = incident.resolvedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 };
      }
      acc[date].total += incident.resolutionTime;
      acc[date].count += 1;
      return acc;
    }, {});

    return Object.entries(groupedByDate).map(([date, data]) => ({
      date,
      averageTime: (data as any).total / (data as any).count
    }));
  }
} 