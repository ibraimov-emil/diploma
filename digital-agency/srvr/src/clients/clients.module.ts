import {forwardRef, Module, Req} from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Client} from "./clients.model";
import {AuthModule} from "../auth/auth.module";
import {User} from "../users/users.model";
import {Employee} from "../employees/employees.model";
import {EmployeesModule} from "../employees/employees.module";
import {RequestTable} from "../requests/requests.model";
import {RequestsModule} from "../requests/requests.module";
import {ProjectsModule} from "../projects/projects,.module";
import {Project} from "../projects/projects.model";

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [
      SequelizeModule.forFeature([Client, User, Employee, RequestTable, Project]),
      forwardRef(() => EmployeesModule),
      forwardRef(() => RequestsModule),
      forwardRef(() => AuthModule),
      forwardRef(() => ProjectsModule),
  ],
    exports: [
        ClientsService,
    ]
})
export class ClientsModule {}
