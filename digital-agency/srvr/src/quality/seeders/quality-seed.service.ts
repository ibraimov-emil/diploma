import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QualityMetric } from '../models/quality-metric.model';
import { Incident } from '../models/incident.model';
import { AuditLog } from '../models/audit-log.model';
import { ServiceMetrics } from '../models/service-metrics.model';
import { ServerMetrics } from '../models/server-metrics.model';
import { User } from '../../auth/models/user.model';

@Injectable()
export class QualitySeedService {
  constructor(
    @InjectModel(QualityMetric)
    private qualityMetricModel: typeof QualityMetric,
    @InjectModel(Incident)
    private incidentModel: typeof Incident,
    @InjectModel(AuditLog)
    private auditLogModel: typeof AuditLog,
    @InjectModel(ServiceMetrics)
    private serviceMetricsModel: typeof ServiceMetrics,
    @InjectModel(ServerMetrics)
    private serverMetricsModel: typeof ServerMetrics,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async seed() {
    // Find a user ID to use for the seed
    let userId: number;
    const user = await this.userModel.findOne();
    
    if (user) {
      userId = user.id;
    } else {
      // If no users exist, create a test user
      const testUser = await this.userModel.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test',
        surname: 'User',
        role: 'admin'
      });
      userId = testUser.id;
    }

    // Seed Quality Metrics
    await this.seedQualityMetrics();
    
    // Seed Incidents
    await this.seedIncidents(userId);
    
    // Seed Audit Logs
    await this.seedAuditLogs(userId);
    
    // Seed Service Metrics
    await this.seedServiceMetrics();
    
    // Seed Server Metrics
    await this.seedServerMetrics();
    
    return 'Seed completed successfully';
  }

  private async seedQualityMetrics() {
    await this.qualityMetricModel.destroy({ truncate: true, cascade: true });
    
    const categories = ['Service Level', 'Availability', 'Performance', 'Security', 'Compliance'];
    const statuses = ['Met', 'Not Met', 'Warning'];
    
    for (let i = 0; i < 20; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const targetValue = parseFloat((Math.random() * 100).toFixed(2));
      const actualValue = parseFloat((Math.random() * 100).toFixed(2));
      
      await this.qualityMetricModel.create({
        name: `${category} Metric ${i + 1}`,
        category,
        targetValue,
        actualValue,
        measurementDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        description: `This is a sample ${category.toLowerCase()} metric`,
        status,
        additionalData: {
          notes: `Additional data for ${category} metric`,
          priority: Math.floor(Math.random() * 3) + 1
        }
      });
    }
  }

  private async seedIncidents(userId: number) {
    await this.incidentModel.destroy({ truncate: true, cascade: true });
    
    const severities = ['high', 'medium', 'low'];
    const statuses = ['open', 'resolved'];
    const titles = [
      'Database server outage',
      'API gateway high latency',
      'CDN cache issues',
      'Application error spike',
      'Service unavailable alert',
      'Auth service failure',
      'Payment processing delay',
      'Storage quota exceeded',
      'Memory leak detected',
      'CPU utilization alert'
    ];
    
    for (let i = 0; i < 10; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const title = titles[i];
      const registrationTime = new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000);
      
      let resolutionTime = null;
      if (status === 'resolved') {
        // Resolution time is 15 min to 4 hours after registration
        resolutionTime = new Date(registrationTime.getTime() + (15 + Math.floor(Math.random() * 225)) * 60000);
      }
      
      await this.incidentModel.create({
        title,
        description: `Description for incident: ${title}`,
        severity,
        status,
        registrationTime,
        resolutionTime,
        userId
      });
    }
  }

  private async seedAuditLogs(userId: number) {
    await this.auditLogModel.destroy({ truncate: true, cascade: true });
    
    const actions = ['create', 'update', 'delete'];
    const entityTypes = ['incident', 'quality_metric', 'service_metric', 'server_metric'];
    
    for (let i = 0; i < 20; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
      const entityId = Math.floor(Math.random() * 10) + 1;
      
      await this.auditLogModel.create({
        action,
        entityType,
        entityId,
        userId,
        details: `${action.charAt(0).toUpperCase() + action.slice(1)}d ${entityType} with ID ${entityId}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000)
      });
    }
  }

  private async seedServiceMetrics() {
    await this.serviceMetricsModel.destroy({ truncate: true, cascade: true });
    
    // Generate data for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Slightly vary metrics day by day
      const uptime = 99.5 + (Math.random() * 0.5); // 99.5% - 100%
      const mttr = 10 + (Math.random() * 10); // 10-20 minutes
      const mtbf = 2000 + (Math.random() * 300); // 2000-2300 minutes
      const responseTime = 200 + (Math.random() * 100); // 200-300ms
      const errorRate = Math.random() * 0.2; // 0-0.2%
      const requestCount = 10000 + Math.floor(Math.random() * 10000); // 10k-20k requests
      
      await this.serviceMetricsModel.create({
        uptime,
        mttr,
        mtbf,
        responseTime,
        errorRate,
        requestCount,
        timestamp: date
      });
    }
  }

  private async seedServerMetrics() {
    await this.serverMetricsModel.destroy({ truncate: true, cascade: true });
    
    // Generate data for the last 24 hours, one entry per hour
    for (let i = 0; i < 24; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      
      // Normal server metrics
      let cpuUsage = 20 + (Math.random() * 40); // 20-60%
      let memoryUsage = 30 + (Math.random() * 30); // 30-60%
      let diskUsage = 40 + (Math.random() * 20); // 40-60%
      let activeConnections = 100 + Math.floor(Math.random() * 150); // 100-250 connections
      let responseTime = 150 + (Math.random() * 100); // 150-250ms
      let errorCount = Math.floor(Math.random() * 10); // 0-10 errors
      let isAnomaly = false;
      
      // Introduce an anomaly every ~6 hours
      if (i % 6 === 0) {
        cpuUsage = 70 + (Math.random() * 25); // 70-95%
        memoryUsage = 70 + (Math.random() * 25); // 70-95%
        responseTime = 300 + (Math.random() * 200); // 300-500ms
        errorCount = 10 + Math.floor(Math.random() * 20); // 10-30 errors
        isAnomaly = true;
      }
      
      await this.serverMetricsModel.create({
        timestamp: date,
        cpuUsage,
        memoryUsage,
        diskUsage,
        activeConnections,
        responseTime,
        errorCount,
        logData: [
          {
            level: isAnomaly ? 'error' : 'info',
            message: isAnomaly ? 'High resource utilization detected' : 'Normal operation',
            context: {
              service: 'api-gateway',
              environment: 'production'
            }
          }
        ],
        isAnomaly,
        predictedLoad: cpuUsage * (1 + (Math.random() * 0.2 - 0.1)) // +/- 10% of current CPU
      });
    }
  }
} 