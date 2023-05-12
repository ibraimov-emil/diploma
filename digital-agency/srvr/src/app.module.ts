import {Module} from "@nestjs/common";
    import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path';
import {EmployeeRoles} from "./roles/employee-roles.model";
import {Employee} from "./employees/employees.model";
import {EmployeesModule} from "./employees/employees.module";
import { AuthModule } from './auth/auth.module';
import {Client} from "./clients/clients.model";
import {ClientsModule} from "./clients/clients.module";
import {ServicesModule} from "./services/services.module";
import {Service} from "./services/services.model";
import {Status} from "./statuses/statuses.model";
import {StatusesModule} from "./statuses/statuses.module";
import {RequestsModule} from "./requests/requests.module";
import {RequestTable} from "./requests/requests.model";
import {Project} from "./projects/projects.model";
import {ProjectsModule} from "./projects/projects,.module";

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
            models: [User, Role, Employee, EmployeeRoles, Client, Service, Status, RequestTable, Project],
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
        ProjectsModule
    ]
})
export class AppModule {}
