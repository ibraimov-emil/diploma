import {forwardRef, Module} from '@nestjs/common';
import { StatusesController } from './statuses.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Status} from "./statuses.model";
import {Role} from "../roles/roles.model";
import {EmployeeRoles} from "../roles/employee-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../posts/posts.model";
import {UsersModule} from "../users/users.module";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";
import {Employee} from "../employees/employees.model";
import {EmployeesModule} from "../employees/employees.module";
import { StatusesService } from './statuses.service';
import {RequestTable} from "../requests/requests.model";
import {RequestsModule} from "../requests/requests.module";
import {Project} from "../projects/projects.model";
import {ProjectsModule} from "../projects/projects,.module";

@Module({
  controllers: [StatusesController],
  providers: [StatusesService],
  imports: [
      SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Post, Client, Employee, RequestTable, Project]),
      forwardRef(() => RequestsModule),
      forwardRef(() => RolesModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => ProjectsModule),
  ],
    exports: [
        StatusesService,
    ]
})
export class StatusesModule {}
