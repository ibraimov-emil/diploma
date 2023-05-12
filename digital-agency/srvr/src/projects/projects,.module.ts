import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "../roles/roles.model";
import {EmployeeRoles} from "../roles/employee-roles.model";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../posts/posts.model";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";
import {Employee} from "../employees/employees.model";
import {EmployeesModule} from "../employees/employees.module";
import {Status} from "../statuses/statuses.model";
import {ServicesModule} from "../services/services.module";
import {StatusesModule} from "../statuses/statuses.module";
import {ClientsModule} from "../clients/clients.module";
import { ProjectsService } from './projects.service';
import {ProjectsController} from "./projects.controller";
import {Project} from "./projects.model";
import {RequestTable} from "../requests/requests.model";
import {RequestsModule} from "../requests/requests.module";

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
      SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Post, Client, Employee, RequestTable, Project]),
      forwardRef(() => ServicesModule),
      forwardRef(() => StatusesModule),
      forwardRef(() => ClientsModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => RequestsModule),
  ],
    exports: [
        ProjectsService,
    ]
})
export class ProjectsModule {}
