import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
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
import {ProjectsModule} from "./projects/projects,.module";
import {StagesModule} from "./stages/stage.module";
import {ChatsModule} from "./chats/chats.module";
import {Chat} from "./chats/chats.model";
import {Message} from "./chats/messages.model";
import {ChatParticipant} from "./chats/chat-participants.model";
import {AuthMiddleware} from "./auth/auth.middleware";

@Module({
    controllers: [],
    providers: [],
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
            port: Number(process.env.POSTGRESS_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRESS_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, Employee, EmployeeRoles, EmployeesProjects, Client, Service, Status, RequestTable, Project, Stage, Chat, Message, ChatParticipant],
            autoLoadModels: true,
            synchronize: true
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
        ChatsModule
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes('*');
    }
}
// export class AppModule implements NestModule {
//     configure(consumer: MiddlewareConsumer) {
//         consumer
//             .apply(AuthMiddleware)
//             .forRoutes('*');
//     }
// }
