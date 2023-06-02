import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {EmployeesModule} from "../employees/employees.module";
import {RolesModule} from "../roles/roles.module";
import { ClientsModule } from 'src/clients/clients.module';
import { RequestsModule } from 'src/requests/requests.module';
import {AccessTokenStrategy} from "./strategies/accessToken.strategy";
import {RefreshTokenStrategy} from "./strategies/refreshToken.strategy";
import {ConfigModule} from "@nestjs/config";
import {ChatsModule} from "../chats/chats.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [
      ConfigModule,
      forwardRef(() => RolesModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => ClientsModule),
      forwardRef(() => RequestsModule),
      forwardRef(() => UsersModule),
      forwardRef(() => ChatsModule),
      JwtModule.register({
          secret: process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS_SECRET',
          signOptions: {
              expiresIn: '15m'
          }
      })
  ],
    exports: [
        AuthService,
        JwtModule,

    ]
})
export class AuthModule {}
