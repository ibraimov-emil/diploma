import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "../roles/roles.model";
import {EmployeeRoles} from "../roles/employee-roles.model";
import {RolesModule} from "../roles/roles.module";
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
import {ProjectsModule} from "../projects/projects,.module";
import {Project} from "../projects/projects.model";
import {StagesController} from "./stage.controller";
import {StagesService} from "./stage.service";
import {Stage} from "./stage.model";
import {Task} from "../tasks/tasks.model";
import {EmployeesTasks} from "../tasks/employees-tasks.model";
import {TasksModule} from "../tasks/tasks,.module";
import {PaymentService} from "./payment.service";
import {Payment} from "./payment.model";
import {YooKassaController} from "./yooKassa.controller";

@Module({
  controllers: [StagesController, YooKassaController],
  providers: [StagesService, PaymentService],
  imports: [
      SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Post, Client, Employee, Stage, Project, Task, EmployeesTasks, Payment]),
      forwardRef(() => ServicesModule),
      forwardRef(() => StatusesModule),
      forwardRef(() => ClientsModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => ProjectsModule),
      forwardRef(() => TasksModule),
  ],
    exports: [
        StagesService,
    ]
})
export class StagesModule {}
