import {forwardRef, Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ProjectsController} from "./projects.controller";
import {ProjectsService} from "./projects.service";
import {Project} from "./projects.model";
import {EmployeesProjects} from "./employees-projects.model";
import {Task} from "../tasks/tasks.model";
import {ProcessMetricsModule} from "../monitoring/process-metrics.module";
import {TasksModule} from "../tasks/tasks.module";
import {ServicesModule} from "../services/services.module";
import {StatusesModule} from "../statuses/statuses.module";
import {ClientsModule} from "../clients/clients.module";
import {AuthModule} from "../auth/auth.module";
import {EmployeesModule} from "../employees/employees.module";
import {RequestsModule} from "../requests/requests.module";

@Module({
    controllers: [ProjectsController],
    providers: [ProjectsService],
    imports: [
        SequelizeModule.forFeature([Project, EmployeesProjects, Task]),
        ProcessMetricsModule,
        forwardRef(() => TasksModule),
        forwardRef(() => ServicesModule),
        forwardRef(() => StatusesModule),
        forwardRef(() => ClientsModule),
        forwardRef(() => AuthModule),
        forwardRef(() => EmployeesModule),
        forwardRef(() => RequestsModule)
    ],
    exports: [ProjectsService]
})
export class ProjectsModule {} 