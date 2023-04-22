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

@Module({
  controllers: [StatusesController],
  providers: [StatusesService],
  imports: [
      SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Post, Client, Employee]),
      forwardRef(() => RolesModule),
      forwardRef(() => AuthModule),
      forwardRef(() => EmployeesModule),
  ],
    exports: [
        StatusesService,
    ]
})
export class StatusesModule {}
