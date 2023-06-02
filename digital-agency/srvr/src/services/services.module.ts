import {forwardRef, Module} from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Service} from "./services.model";
import {Role} from "../roles/roles.model";
import {EmployeeRoles} from "../roles/employee-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";
import {Employee} from "../employees/employees.model";
import {EmployeesModule} from "../employees/employees.module";
import {RequestTable} from "../requests/requests.model";
import {RequestsModule} from "../requests/requests.module";
import {ProjectsModule} from "../projects/projects,.module";
import {Project} from "../projects/projects.model";

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [
      SequelizeModule.forFeature([Service, Role, EmployeeRoles, User, Client, Employee, RequestTable, Project]),
      forwardRef(() => RequestsModule),
      forwardRef(() => ProjectsModule),
      forwardRef(() => RolesModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
  ],
    exports: [
        ServicesService,
    ]
})
export class ServicesModule {}
