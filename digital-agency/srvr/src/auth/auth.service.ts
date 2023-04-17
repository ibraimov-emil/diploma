import {ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";
import {LoginUserDto} from "../users/dto/login-user.dto";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
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

    // async logout(context: ExecutionContext){
    //     // Проверка валидности токена
    //
    //     const req = context.switchToHttp().getRequest()
    //     try {
    //         const authHeader = req.headers.authorization;
    //         const bearer = authHeader.split(' ')[0]
    //         const token = authHeader.split(' ')[1]
    //
    //
    //         const user = this.jwtService.verify(token);
    //         delete user;
    //         return {message: 'Пользователь успешно разлогинен'};
    //     } catch (e) {
    //         throw new UnauthorizedException({message: 'Пользователь не авторизован'})
    //     }
    //
    //
    //     // const decodedToken = this.jwtService.decode(token);
    //     // if (!decodedToken) {
    //     //     throw new UnauthorizedException({message: 'Некорректный токен'});
    //     // }
    //     //
    //     // // Запись информации о выходе пользователя в базу данных
    //     // const userId = decodedToken['id'];
    //     // await this.userService.updateLogoutTime(userId);
    //
    //     // Очистка сеанса пользователя
    //     // Ваша логика очистки сеанса пользователя здесь
    //
    //     // Удаление токена из базы данных
    //     // Ваша логика удаления токена из базы данных здесь
    // }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id}
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
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
}
