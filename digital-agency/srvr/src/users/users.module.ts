import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Employee} from "../employees/employees.model";
import {EmployeesModule} from "../employees/employees.module";
import {FilesModule} from "../files/files.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Employee]),
      RolesModule,
      EmployeesModule,
      forwardRef(() => AuthModule),
      FilesModule
  ],
    exports: [
        UsersService,
    ]
})
export class UsersModule {}
