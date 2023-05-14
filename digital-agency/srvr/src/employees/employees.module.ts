import {forwardRef, Module} from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Employee} from "./employees.model";
import {Role} from "../roles/roles.model";
import {EmployeeRoles} from "../roles/employee-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../posts/posts.model";
import {UsersModule} from "../users/users.module";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";
import {Project} from "../projects/projects.model";
import {ProjectsModule} from "../projects/projects,.module";

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [
      SequelizeModule.forFeature([Employee, Role, EmployeeRoles, User, Post, Client, Project]),
      forwardRef(() => RolesModule),
      forwardRef(() => AuthModule),
      forwardRef(() => ProjectsModule),
  ],
    exports: [
        EmployeesService,
    ]
})
export class EmployeesModule {}
