// import {Injectable, UnauthorizedException} from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthService } from './auth.service';
// import { JwtPayload } from './jwt-payload.interface';
// import * as bcrypt from 'bcryptjs'
// import {LoginUserDto} from "../users/dto/login-user.dto";
//
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     private userService: any;
//     constructor(private authService: AuthService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: 'secret_key_random', // Замените на ваш секретный ключ
//         });
//     }
//
//     private async validateUser(userDto: LoginUserDto) {
//         const user = await this.userService.getUserByEmail(userDto.email);
//         const passwordEquals = await bcrypt.compare(userDto.password, user.password);
//         if (user && passwordEquals) {
//             return user;
//         }
//         throw new UnauthorizedException({message: 'Некорректный email или пароль'})
//     }
// }