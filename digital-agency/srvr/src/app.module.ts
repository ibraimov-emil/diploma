import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path';
import {Employee} from "./employees/employees.model";
import {EmployeeRoles} from "./roles/employee-roles.model";
import {EmployeesProjects} from "./projects/employees-projects.model";
import {Client} from "./clients/clients.model";
import {Service} from "./services/services.model";
import {Status} from "./statuses/statuses.model";
import {RequestTable} from "./requests/requests.model";
import {Project} from "./projects/projects.model";
import {Stage} from "./stages/stage.model";
import {Role} from "./roles/roles.model";
import {User} from "./users/users.model";
import {UsersModule} from "./users/users.module";
import {EmployeesModule} from "./employees/employees.module";
import {RolesModule} from "./roles/roles.module";
import {AuthModule} from "./auth/auth.module";
import {ClientsModule} from "./clients/clients.module";
import {ServicesModule} from "./services/services.module";
import {StatusesModule} from "./statuses/statuses.module";
import {RequestsModule} from "./requests/requests.module";
import {ProjectsModule} from "./projects/projects.module";
import {StagesModule} from "./stages/stage.module";
import {ChatsModule} from "./chats/chats.module";
import {Chat} from "./chats/chats.model";
import {Message} from "./chats/messages.model";
import {ChatParticipant} from "./chats/chat-participants.model";
import {AuthMiddleware} from "./auth/auth.middleware";
import {ChatsGateway} from "./chats/chats.gateway";
import {TasksModule} from "./tasks/tasks.module";
import {Task} from "./tasks/tasks.model";
import {EmployeesTasks} from "./tasks/employees-tasks.model";
import {Payment} from "./stages/payment.model";
import {StatsModule} from "./stats/stats.module";
import {QualityModule} from "./quality/quality.module";
import {QualityMetric} from "./quality/models/quality-metric.model";
import {ExperimentalResearch} from "./quality/models/experimental-research.model";
import {ServerMetrics} from "./quality/models/server-metrics.model";
import {Incident} from "./quality/models/incident.model";
import {AuditLog} from "./quality/models/audit-log.model";
import {ServiceMetrics as QualityServiceMetrics} from "./quality/models/service-metrics.model";
import {MonitoringModule} from "./monitoring/monitoring.module";
import {ServiceMetrics} from "./monitoring/models/service-metrics.model";
import {ProcessMetricsModule} from "./monitoring/process-metrics.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RequestToProjectTracking} from "./monitoring/entities/request-to-project-tracking.entity";
import {ChatResponseTracking} from "./monitoring/entities/chat-response-tracking.entity";
import {InvoicePaymentTracking} from "./monitoring/entities/invoice-payment-tracking.entity";
import {TaskCompletionTracking} from "./monitoring/entities/task-completion-tracking.entity";
import {SLADefinitions} from "./monitoring/entities/sla-definitions.entity";
import {PrometheusModule} from "./prometheus/prometheus.module";

@Module({
    controllers: [],
    providers: [ChatsGateway],
    imports: [
        ConfigModule.forRoot({
           envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve( __dirname, 'static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, Employee, EmployeeRoles, EmployeesProjects, Client, Service, Status, RequestTable, Project, Stage, Chat, Message, ChatParticipant, Task, EmployeesTasks, Payment, QualityMetric, ExperimentalResearch, ServerMetrics, Incident, AuditLog, QualityServiceMetrics, ServiceMetrics],
            autoLoadModels: true,
            synchronize: true
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: parseInt(process.env.POSTGRES_PORT) || 5432,
            username: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'admin',
            database: process.env.POSTGRES_DB || 'digital-agency',
            entities: [
                RequestToProjectTracking,
                ChatResponseTracking,
                InvoicePaymentTracking,
                TaskCompletionTracking,
                SLADefinitions
            ],
            synchronize: false,
            migrations: ['dist/monitoring/migrations/*.js'],
            migrationsRun: false,
            migrationsTableName: 'migrations'
        }),
        UsersModule,
        EmployeesModule,
        RolesModule,
        AuthModule,
        ClientsModule,
        ServicesModule,
        StatusesModule,
        RequestsModule,
        ProjectsModule,
        StagesModule,
        ChatsModule,
        StatsModule,
        TasksModule,
        QualityModule,
        MonitoringModule,
        ProcessMetricsModule,
        PrometheusModule
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                { path: 'services', method: RequestMethod.ALL },
                { path: 'quality-seed', method: RequestMethod.ALL },
                { path: 'health', method: RequestMethod.ALL },
                { path: 'metrics', method: RequestMethod.ALL },
                { path: 'metrics/process', method: RequestMethod.ALL },
                'auth/(.*)'
            )
            .forRoutes('*');
    }
}
// export class AppModule {}
