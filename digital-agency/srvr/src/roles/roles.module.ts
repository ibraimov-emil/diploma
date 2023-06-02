import {forwardRef, Module} from '@nestjs/common';
import {RolesService} from './roles.service';
import {RolesController} from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {EmployeeRoles} from "./employee-roles.model";
import {Employee} from "../employees/employees.model";
import {AuthModule} from "../auth/auth.module";
import {EmployeesModule} from "../employees/employees.module";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([Role, Employee, EmployeeRoles]),
    forwardRef(() => AuthModule),
    forwardRef(() => EmployeesModule),
  ],
  exports: [
    RolesService
  ]
})
export class RolesModule {}
