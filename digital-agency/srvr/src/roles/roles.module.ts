import {Module} from '@nestjs/common';
import {RolesService} from './roles.service';
import {RolesController} from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {EmployeeRoles} from "./employee-roles.model";
import {Employee} from "../employees/employees.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([Role, Employee, EmployeeRoles]),
    AuthModule
  ],
  exports: [
    RolesService
  ]
})
export class RolesModule {}
