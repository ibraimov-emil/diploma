import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Incident } from './models/incident.model';
import { Op } from 'sequelize';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectModel(Incident)
    private incidentModel: typeof Incident,
  ) {}

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
} 