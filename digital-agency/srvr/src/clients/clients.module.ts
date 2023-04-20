import {forwardRef, Module} from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Client} from "./clients.model";
import {Role} from "../roles/roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../posts/posts.model";
import {UsersModule} from "../users/users.module";
import {User} from "../users/users.model";
import {Employee} from "../employees/employees.model";

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [
      SequelizeModule.forFeature([Client, User, Post, Employee]),
      forwardRef(() => AuthModule),
  ],
    exports: [
        ClientsService,
    ]
})
export class ClientsModule {}
