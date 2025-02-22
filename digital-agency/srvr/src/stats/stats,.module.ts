import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "../roles/roles.model";
import {EmployeeRoles} from "../roles/employee-roles.model";
import {AuthModule} from "../auth/auth.module";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";
import {Employee} from "../employees/employees.model";
import {EmployeesModule} from "../employees/employees.module";
import {Status} from "../statuses/statuses.model";
import {ServicesModule} from "../services/services.module";
import {StatusesModule} from "../statuses/statuses.module";
import {ClientsModule} from "../clients/clients.module";
import { StatsService } from './stats.service';
import {StatsController} from "./stats.controller";
import {RequestTable} from "../requests/requests.model";
import {RequestsModule} from "../requests/requests.module";
import {Project} from "../projects/projects.model";
import {StagesModule} from "../stages/stage.module";
import {Stage} from "../stages/stage.model";
import {TasksModule} from "../tasks/tasks,.module";
import {Task} from "../tasks/tasks.model";

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [
      SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Client, Employee, RequestTable, Project, Stage, Task]),
      forwardRef(() => ServicesModule),
      forwardRef(() => StatusesModule),
      forwardRef(() => ClientsModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => RequestsModule),
      forwardRef(() => StagesModule),
      forwardRef(() => TasksModule),
  ],
    exports: [
        StatsService,
    ]
})
export class StatsModule {}
