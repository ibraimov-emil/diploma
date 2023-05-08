import {
    BadRequestException, Body,
    ExecutionContext, ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable, Res,
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
import { ConfigService } from "@nestjs/config";
import { Response } from 'express';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private clientService: ClientsService,
                private requestService: RequestsService,
                private jwtService: JwtService,
                private configService: ConfigService,
                ) {}

    async login(userDto: LoginUserDto) {
        const user = await this.validateUser(userDto)
        const tokens = await this.getTokens(user.id, user);
        // res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return {...tokens, user};
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

        const tokens = await this.getTokens(user.id, user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {...tokens, user};
    }

    async logout(userId: number) {
        // res.clearCookie('refreshToken');
        return this.userService.updateUser(userId, { refreshToken: null });
    }


    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, employee: user.employee, client: user.client}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) throw new BadRequestException('Пользователя не существует');
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.userService.updateUser(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async getTokens(userId: number, user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: user.email, id: user.id, employee: user.employee, client: user.client
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: user.email, id: user.id, employee: user.employee, client: user.client
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '30d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    hashData(data: string) {
        return argon2.hash(data);
    }

    async refreshTokens(userId: number, refreshToken: string) {

        const user = await this.userService.findById(userId);
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');

        const refreshTokenMatches = await argon2.verify(
            user.refreshToken,
            refreshToken,
        );

        console.log('user.refreshToken')
        console.log(user.refreshToken)
        console.log(refreshToken)
        console.log(refreshTokenMatches)
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return {...tokens, user};
    }

    // async check() {
    //     // const user = await this.validateUser(userDto)
    //     // return this.generateToken(user)
    // }
}
