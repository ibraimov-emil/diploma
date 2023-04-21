import {forwardRef, Module} from '@nestjs/common';
import {RolesService} from './roles.service';
import {RolesController} from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {EmployeeRoles} from "./employee-roles.model";
import {Employee} from "../employees/employees.model";
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {EmployeesService} from "../employees/employees.service";
import {EmployeesGuard} from "../auth/employees.guard";
import {EmployeesModule} from "../employees/employees.module";

@Module({
  providers: [RolesService, EmployeesGuard],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([Role, Employee, EmployeeRoles]),
    AuthModule,
    forwardRef(() => EmployeesModule),
  ],
  exports: [
    RolesService
  ]
})
export class RolesModule {}
