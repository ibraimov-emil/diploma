import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Incident } from './models/incident.model';
import { Op } from 'sequelize';
import { ChatService } from '../chats/chats.service';
import { PrometheusService } from '../monitoring/prometheus.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident)
    private incidentModel: typeof Incident,
    private chatService: ChatService,
    private prometheusService: PrometheusService
  ) {
    // Initialize Prometheus metrics for user incidents
    this.prometheusService.createUserIncidentMetrics();
  }

  async findAll(): Promise<Incident[]> {
    return this.incidentModel.findAll();
  }

  async findOne(id: number): Promise<Incident> {
    return this.incidentModel.findByPk(id);
  }

  async findByStatus(status: string): Promise<Incident[]> {
    return this.incidentModel.findAll({
      where: { status },
    });
  }

  async findBySeverity(severity: string): Promise<Incident[]> {
    return this.incidentModel.findAll({
      where: { severity },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Incident[]> {
    return this.incidentModel.findAll({
      where: {
        registrationTime: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
  }

  async getIncidentStats() {
    const totalIncidents = await this.incidentModel.count();
    
    const openIncidents = await this.incidentModel.count({
      where: { status: 'open' },
    });
    
    const resolvedIncidents = await this.incidentModel.count({
      where: { status: 'resolved' },
    });
    
    const highSeverityIncidents = await this.incidentModel.count({
      where: { severity: 'high' },
    });
    
    const mediumSeverityIncidents = await this.incidentModel.count({
      where: { severity: 'medium' },
    });
    
    const lowSeverityIncidents = await this.incidentModel.count({
      where: { severity: 'low' },
    });
    
    // Calculate MTTR (Mean Time To Resolution) for resolved incidents
    const resolvedIncidentsData = await this.incidentModel.findAll({
      where: { 
        status: 'resolved',
        resolutionTime: { [Op.ne]: null },
      },
    });
    
    let totalResolutionTime = 0;
    resolvedIncidentsData.forEach(incident => {
      const resolutionTime = new Date(incident.resolutionTime).getTime();
      const registrationTime = new Date(incident.registrationTime).getTime();
      const timeDiff = (resolutionTime - registrationTime) / (1000 * 60); // in minutes
      totalResolutionTime += timeDiff;
    });
    
    const mttr = resolvedIncidentsData.length > 0 
      ? totalResolutionTime / resolvedIncidentsData.length 
      : 0;
    
    // Update resolution time metric
    this.prometheusService.updateGauge('user_reported_incidents_resolution_time', mttr);
    
    return {
      totalIncidents,
      openIncidents,
      resolvedIncidents,
      highSeverityIncidents,
      mediumSeverityIncidents,
      lowSeverityIncidents,
      mttr,
    };
  }

  async createUserIncident(incidentData: {
    title?: string;
    description?: string;
    severity?: string;
    userId?: number;
    status?: string;
    registrationTime?: Date;
    relatedEntityType?: string;
    relatedEntityId?: number;
    requestTitle?: string;
    additionalInfo?: string;
    metadata?: string;
  }): Promise<Incident> {
    try {
      console.log('Service received incident data:', incidentData);
      
      // Preserve original values, only use defaults if values are missing
      const sanitizedData = {
        title: incidentData.title || 'Без заголовка',
        description: incidentData.description || 'Без описания',
        severity: incidentData.severity || 'medium',
        status: incidentData.status || 'open',
        userId: incidentData.userId || 1,
        registrationTime: incidentData.registrationTime || new Date(),
        metadata: incidentData.metadata || null
      };

      // No additional processing for metadata, we'll use what the controller gave us

      console.log('Final data before creating incident:', sanitizedData);
      
      // Create incident record with sanitized data
      const incident = await this.incidentModel.create(sanitizedData);
      console.log('Created incident:', incident);
      
      // Update Prometheus metrics
      this.prometheusService.incrementCounter('user_reported_incidents_total');
      
      // Send notification to support team
      await this.notifySupportTeam(incident);
      
      return incident;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  }

  async updateIncidentStatus(id: number, status: string, resolutionNotes?: string): Promise<Incident> {
    const incident = await this.findOne(id);
    if (!incident) {
      throw new Error(`Incident with ID ${id} not found`);
    }

    const previousStatus = incident.status;
    incident.status = status;
    
    if (status === 'resolved' && previousStatus !== 'resolved') {
      incident.resolutionTime = new Date();
      incident.metadata = incident.metadata ? 
        JSON.stringify({
          ...JSON.parse(incident.metadata as string),
          resolutionNotes
        }) : 
        JSON.stringify({ resolutionNotes });
        
      // Update resolution time metrics when an incident is resolved
      const resolutionTime = new Date();
      const registrationTime = new Date(incident.registrationTime);
      const timeDiffMinutes = (resolutionTime.getTime() - registrationTime.getTime()) / (1000 * 60);
      
      // Recalculate average resolution time
      const resolvedIncidents = await this.incidentModel.count({
        where: { status: 'resolved' }
      });
      
      const totalResolutionTime = await this.getAverageResolutionTime() * (resolvedIncidents - 1) + timeDiffMinutes;
      const newAvgResolutionTime = totalResolutionTime / resolvedIncidents;
      
      this.prometheusService.updateGauge('user_reported_incidents_resolution_time', newAvgResolutionTime);
    }

    await incident.save();
    return incident;
  }

  private async getAverageResolutionTime(): Promise<number> {
    const resolvedIncidents = await this.incidentModel.findAll({
      where: { 
        status: 'resolved',
        resolutionTime: { [Op.ne]: null } 
      }
    });
    
    if (resolvedIncidents.length === 0) {
      return 0;
    }
    
    let totalResolutionTime = 0;
    resolvedIncidents.forEach(incident => {
      const resolutionTime = new Date(incident.resolutionTime).getTime();
      const registrationTime = new Date(incident.registrationTime).getTime();
      const timeDiff = (resolutionTime - registrationTime) / (1000 * 60); // in minutes
      totalResolutionTime += timeDiff;
    });
    
    return totalResolutionTime / resolvedIncidents.length;
  }

  private async notifySupportTeam(incident: Incident): Promise<void> {
    try {
      // Create or find support chat for this user
      const supportChatId = await this.createOrFindSupportChat(incident.userId);
      
      // Format incident details for chat
      const message = `🚨 New incident reported:\n
Title: ${incident.title}
Severity: ${incident.severity}
ID: ${incident.id}
Reported by user: ${incident.userId}
Time: ${incident.registrationTime}

Description: ${incident.description}

This incident requires attention from the support team.`;

      // Send message to support chat
      if (supportChatId) {
        await this.chatService.sendMessage(
          supportChatId,
          1, // System user ID
          message
        );
      }
    } catch (error) {
      console.error('Failed to notify support team:', error);
      // Don't throw the error to avoid breaking the incident creation flow
    }
  }

  private async createOrFindSupportChat(userId: number): Promise<number | null> {
    try {
      // Find existing support chat for this user
      const userChats = await this.chatService.getUserChats(userId);
      const supportChat = userChats.find(chat => chat.chat?.name === 'Support Chat');
      
      if (supportChat) {
        return supportChat.chatId;
      }
      
      // Create new support chat
      const newChat = await this.chatService.createChat('Support Chat', 1); // Created by system/admin
      
      // Add the user to the chat
      await this.chatService.addUserToChat(userId, newChat.id);
      
      return newChat.id;
    } catch (error) {
      console.error('Failed to create support chat:', error);
      return null;
    }
  }
} 