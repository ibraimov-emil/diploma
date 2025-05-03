import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Incident } from '../models/incident.model';
import { ServiceMetrics } from '../models/service-metrics.model';
import { AuditLog } from '../models/audit-log.model';
import { Op } from 'sequelize';

@Injectable()
export class ServiceQualityService {
    constructor(
        @InjectModel(Incident) private incidentRepository: typeof Incident,
        @InjectModel(ServiceMetrics) private metricsRepository: typeof ServiceMetrics,
        @InjectModel(AuditLog) private auditLogRepository: typeof AuditLog,
    ) {}

    async getIncidents(status?: string, severity?: string): Promise<Incident[]> {
        const where: any = {};
        
        if (status) {
            where.status = status;
        }
        
        if (severity) {
            where.severity = severity;
        }

        return this.incidentRepository.findAll({
            where,
            order: [['registrationTime', 'DESC']]
        });
    }

    async logIncident(incidentData: Partial<Incident>): Promise<Incident> {
        const incident = await this.incidentRepository.create({
            ...incidentData,
            status: 'open'
        });

        await this.auditLogRepository.create({
            action: 'create',
            entityType: 'incident',
            entityId: incident.id,
            userId: incident.userId,
            details: `Created incident: ${incident.title}`
        });

        return incident;
    }

    async resolveIncident(id: number): Promise<Incident> {
        const incident = await this.incidentRepository.findByPk(id);
        if (!incident) {
            throw new Error('Incident not found');
        }

        incident.status = 'resolved';
        incident.resolutionTime = new Date();
        await incident.save();

        await this.auditLogRepository.create({
            action: 'resolve',
            entityType: 'incident',
            entityId: incident.id,
            userId: incident.userId,
            details: `Resolved incident: ${incident.title}`
        });

        return incident;
    }

    async calculateMetrics(): Promise<ServiceMetrics> {
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Get incidents for the last 24 hours
        const incidents = await this.incidentRepository.findAll({
            where: {
                registrationTime: {
                    [Op.gte]: dayAgo
                }
            }
        });

        // Calculate MTTR
        const resolvedIncidents = incidents.filter(i => i.resolutionTime);
        const mttr = resolvedIncidents.length > 0
            ? resolvedIncidents.reduce((sum, i) => {
                const resolutionTime = i.resolutionTime.getTime();
                const registrationTime = i.registrationTime.getTime();
                return sum + (resolutionTime - registrationTime);
            }, 0) / resolvedIncidents.length / (60 * 1000) // Convert to minutes
            : 0;

        // Calculate MTBF
        const incidentTimes = incidents.map(i => i.registrationTime.getTime()).sort();
        const mtbf = incidentTimes.length > 1
            ? (incidentTimes[incidentTimes.length - 1] - incidentTimes[0]) / (incidentTimes.length - 1) / (60 * 1000)
            : 0;

        // Calculate uptime
        const downtime = resolvedIncidents.reduce((sum, i) => {
            const resolutionTime = i.resolutionTime.getTime();
            const registrationTime = i.registrationTime.getTime();
            return sum + (resolutionTime - registrationTime);
        }, 0);
        const uptime = ((24 * 60 * 60 * 1000 - downtime) / (24 * 60 * 60 * 1000)) * 100;

        const metrics = await this.metricsRepository.create({
            uptime,
            mttr,
            mtbf,
            responseTime: 0, // This would be calculated from actual request data
            errorRate: 0, // This would be calculated from actual request data
            requestCount: 0 // This would be calculated from actual request data
        });

        return metrics;
    }

    async logAudit(action: string, entityType: string, entityId: number, userId: number, details: string): Promise<AuditLog> {
        return this.auditLogRepository.create({
            action,
            entityType,
            entityId,
            userId,
            details
        });
    }

    async getAuditLogs(): Promise<AuditLog[]> {
        return this.auditLogRepository.findAll({
            order: [['timestamp', 'DESC']],
            limit: 100
        });
    }
} 