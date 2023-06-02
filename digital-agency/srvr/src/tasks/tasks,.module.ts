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
import {RequestTable} from "../requests/requests.model";
import {RequestsModule} from "../requests/requests.module";
import {TasksController} from "./tasks.controller";
import {TasksService} from "./tasks.service";
import {Project} from "../projects/projects.model";
import {Task} from "./tasks.model";
import {EmployeesTasks} from "./employees-tasks.model";

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
      SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Client, Employee, RequestTable, Project, Task, EmployeesTasks]),
      forwardRef(() => ServicesModule),
      forwardRef(() => StatusesModule),
      forwardRef(() => ClientsModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => RequestsModule),
  ],
    exports: [
        TasksService,
    ]
})
export class TasksModule {}
