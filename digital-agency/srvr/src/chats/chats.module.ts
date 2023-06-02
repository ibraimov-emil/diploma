import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "../roles/roles.model";
import {EmployeeRoles} from "../roles/employee-roles.model";
import {AuthModule} from "../auth/auth.module";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";
import {Employee} from "../employees/employees.model";
import {EmployeesModule} from "../employees/employees.module";
import {Status} from "../statuses/statuses.model";
import {ServicesModule} from "../services/services.module";
import {StatusesModule} from "../statuses/statuses.module";
import {ClientsModule} from "../clients/clients.module";

import {RequestTable} from "../requests/requests.model";
import {RequestsModule} from "../requests/requests.module";
import {Project} from "../projects/projects.model";
import {Chat} from "./chats.model";
import {ChatParticipant} from "./chat-participants.model";
import {Message} from "./messages.model";
import {ChatService} from "./chats.service";
import {ChatController} from "./chats.controller";
import {UsersModule} from "../users/users.module";
import {ProjectsModule} from "../projects/projects,.module";

@Module({
    controllers: [ChatController],
    providers: [ChatService],
    imports: [
        SequelizeModule.forFeature([Status, Role, EmployeeRoles, User, Client, Employee, RequestTable, Project, Chat, ChatParticipant, Message]),
        forwardRef(() => RequestsModule),
        forwardRef(() => UsersModule),
        forwardRef(() => ServicesModule),
        forwardRef(() => StatusesModule),
        forwardRef(() => ClientsModule),
        forwardRef(() => AuthModule),
        forwardRef(() => EmployeesModule),
        forwardRef(() => ProjectsModule),
    ],
    exports: [
        ChatService,
    ]
})
export class ChatsModule {}
