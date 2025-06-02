import { Sequelize } from 'sequelize-typescript';
import { ServiceMetrics } from './monitoring/models/service-metrics.model';
import { ServiceMetrics as QualityServiceMetrics } from './quality/models/service-metrics.model';
import { User } from './users/users.model';
import { Incident } from './quality/models/incident.model';
import { AuditLog } from './quality/models/audit-log.model';
import { ServerMetrics } from './quality/models/server-metrics.model';
import { Employee } from './employees/employees.model';
import { Client } from './clients/clients.model';
import { Role } from './roles/roles.model';
import { EmployeeRoles } from './roles/employee-roles.model';
import { Project } from './projects/projects.model';
import { EmployeesProjects } from './projects/employees-projects.model';
import { Task } from './tasks/tasks.model';
import { EmployeesTasks } from './tasks/employees-tasks.model';
import { Chat } from './chats/chats.model';
import { ChatParticipant } from './chats/chat-participants.model';
import { databaseConfig } from './config/database.config';

async function syncDatabase() {
  const sequelize = new Sequelize({
    dialect: databaseConfig.dialect,
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    logging: console.log,
    models: [
      ServiceMetrics, 
      QualityServiceMetrics, 
      User,
      Incident,
      AuditLog,
      ServerMetrics,
      Employee,
      Client,
      Role,
      EmployeeRoles,
      Project,
      EmployeesProjects,
      Task,
      EmployeesTasks,
      Chat,
      ChatParticipant
    ],
  });

  try {
    console.log('Starting database synchronization...');
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // First, add the role column to the users table with NULL allowed
    try {
      await sequelize.query(`
        ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" VARCHAR(255) NULL;
      `);
      console.log('Role column added or already exists');
      
      // Update existing rows
      await sequelize.query(`
        UPDATE "users" SET "role" = 'user' WHERE "role" IS NULL;
      `);
      console.log('Existing users updated with default role');
      
      // Make the column NOT NULL
      await sequelize.query(`
        ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
      `);
      console.log('Role column set to NOT NULL');
    } catch (error) {
      console.log('Error updating users table:', error.message);
    }
    
    // Force true will drop tables before recreating them
    const force = process.env.DB_FORCE_SYNC === 'true';
    
    // Alter true will update tables to match models (safer than force)
    const alter = process.env.DB_ALTER_SYNC === 'true' || true;
    
    await sequelize.sync({ force, alter });
    console.log('Database synchronized successfully.');
    
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
}

// Run the sync function
syncDatabase(); 