import {
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Employee} from "../employees/employees.model";
import { ClientsService } from 'src/clients/clients.service';
import { RequestsService } from 'src/requests/requests.service';
import { CreateClientRequestDto } from './dto/create-client-request.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private clientService: ClientsService,
                private requestService: RequestsService,
                private jwtService: JwtService) {}

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword})
        return this.generateToken(user)
    }

    async registrationClient(userClientDto: CreateClientRequestDto) {
        const candidate = await this.userService.getUserByEmail(userClientDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userClientDto.password, 5);
        const user = await this.userService.createUser({...userClientDto, password: hashPassword})
        const client = await this.clientService.createClient({...userClientDto, userId: user.id})
        console.log({...userClientDto})
        await this.requestService.createRequest({...userClientDto, clientId: client.id, statusId: 1})
        return this.generateToken(user)
    }

    async logout() {
        return { message: 'Вы успешно вышли из системы' };
    }


    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, employee: user.employee, client: user.client}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }

    async check() {
        // const user = await this.validateUser(userDto)
        // return this.generateToken(user)
    }
}
