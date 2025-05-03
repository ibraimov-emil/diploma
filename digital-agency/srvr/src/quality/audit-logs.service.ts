import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from './models/audit-log.model';
import { Op } from 'sequelize';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog)
    private auditLogModel: typeof AuditLog,
  ) {}

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogModel.findAll({
      order: [['timestamp', 'DESC']],
    });
  }

  async findOne(id: number): Promise<AuditLog> {
    return this.auditLogModel.findByPk(id);
  }

  async findByEntityType(entityType: string): Promise<AuditLog[]> {
    return this.auditLogModel.findAll({
      where: { entityType },
      order: [['timestamp', 'DESC']],
    });
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.auditLogModel.findAll({
      where: { action },
      order: [['timestamp', 'DESC']],
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogModel.findAll({
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['timestamp', 'DESC']],
    });
  }

  async getAuditStats() {
    const totalLogs = await this.auditLogModel.count();
    
    const createActions = await this.auditLogModel.count({
      where: { action: 'create' },
    });
    
    const updateActions = await this.auditLogModel.count({
      where: { action: 'update' },
    });
    
    const deleteActions = await this.auditLogModel.count({
      where: { action: 'delete' },
    });
    
    const entityTypeCounts = {};
    const entityTypes = ['incident', 'quality_metric', 'service_metric', 'server_metric'];
    
    for (const entityType of entityTypes) {
      entityTypeCounts[entityType] = await this.auditLogModel.count({
        where: { entityType },
      });
    }
    
    return {
      totalLogs,
      actionCounts: {
        create: createActions,
        update: updateActions,
        delete: deleteActions,
      },
      entityTypeCounts,
    };
  }
} 