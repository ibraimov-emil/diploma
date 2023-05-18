import {Injectable, NestMiddleware, UnauthorizedException} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/users.model";

interface AuthenticatedRequest extends Request {
    user: User;
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UsersService, private jwtService: JwtService) {}

    async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        // Получить информацию о пользователе (например, из токена аутентификации)
        const authHeader = req.headers.authorization;
        if(authHeader) {
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            const payload = this.jwtService.verify(token);

            const userId = payload.id; // Логика получения ID пользователя

            // Загрузить пользователя из сервиса пользователей
            const user = await this.userService.findById(userId);

            // Добавить пользователя в объект запроса
            req.user = user;
        }
        // Продолжить выполнение цепочки middleware
        next();
    }
}