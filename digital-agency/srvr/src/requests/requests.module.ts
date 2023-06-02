import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "../roles/roles.model";
import {EmployeeRoles} from "../roles/employee-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";
import {Employee} from "../employees/employees.model";
import {EmployeesModule} from "../employees/employees.module";
import {Status} from "../statuses/statuses.model";
import {RequestsController} from "./requests.controller";
import {RequestsService} from "./requests.service";
import {RequestTable} from "./requests.model";
import {ServicesModule} from "../services/services.module";
import {StatusesModule} from "../statuses/statuses.module";
import {ClientsModule} from "../clients/clients.module";
import {ProjectsModule} from "../projects/projects,.module";
import {Project} from "../projects/projects.model";

@Module({
  controllers: [RequestsController],
  providers: [RequestsService],
  imports: [
      SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Client, Employee, RequestTable, Project]),
      forwardRef(() => ServicesModule),
      forwardRef(() => StatusesModule),
      forwardRef(() => ClientsModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => ProjectsModule),
  ],
    exports: [
        RequestsService,
    ]
})
export class RequestsModule {}
