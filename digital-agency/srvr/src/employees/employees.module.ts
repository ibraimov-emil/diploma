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

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [
      SequelizeModule.forFeature([Employee, Role, EmployeeRoles, User, Post]),
      RolesModule,
      forwardRef(() => AuthModule),
  ],
    exports: [
        EmployeesService,
    ]
})
export class EmployeesModule {}
