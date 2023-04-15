import {forwardRef, Module} from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./employees.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/employee-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../posts/posts.model";

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [
      SequelizeModule.forFeature([User, Role, UserRoles, Post]),
      RolesModule,
      forwardRef(() => AuthModule),
  ],
    exports: [
        EmployeesService,
    ]
})
export class EmployeesModule {}
