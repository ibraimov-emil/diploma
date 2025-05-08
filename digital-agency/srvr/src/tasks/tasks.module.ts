import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {TasksController} from "./tasks.controller";
import {TasksService} from "./tasks.service";
import {Task} from "./tasks.model";
import {EmployeesTasks} from "./employees-tasks.model";
import {Status} from "../statuses/statuses.model";
import {Stage} from "../stages/stage.model";
import {Employee} from "../employees/employees.model";
import {Project} from "../projects/projects.model";
import {AuthModule} from "../auth/auth.module";
import {EmployeesModule} from "../employees/employees.module";

@Module({
    controllers: [TasksController],
    providers: [TasksService],
    imports: [
        SequelizeModule.forFeature([Task, EmployeesTasks, Status, Stage, Employee, Project]),
        forwardRef(() => AuthModule),
        forwardRef(() => EmployeesModule)
    ],
    exports: [TasksService]
})
export class TasksModule {} 