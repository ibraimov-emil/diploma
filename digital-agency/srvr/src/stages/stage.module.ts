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

@Module({
  controllers: [StagesController],
  providers: [StagesService],
  imports: [
      SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Post, Client, Employee, Stage, Project]),
      forwardRef(() => ServicesModule),
      forwardRef(() => StatusesModule),
      forwardRef(() => ClientsModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => ProjectsModule),
  ],
    exports: [
        StagesService,
    ]
})
export class StagesModule {}
