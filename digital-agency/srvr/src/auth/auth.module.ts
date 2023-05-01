import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {EmployeesModule} from "../employees/employees.module";
import {EmployeesService} from "../employees/employees.service";
import {RolesModule} from "../roles/roles.module";
import { ClientsModule } from 'src/clients/clients.module';
import { RequestsModule } from 'src/requests/requests.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      forwardRef(() => RolesModule),
      forwardRef(() => EmployeesModule),
      forwardRef(() => ClientsModule),
      forwardRef(() => RequestsModule),
      forwardRef(() => UsersModule),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'SECRET',
        signOptions: {
          expiresIn: '24h'
        }
      })
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
