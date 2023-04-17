import {Body, Controller, ExecutionContext, Post, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {AuthService} from "./auth.service";
import {Role} from "../roles/roles.model";
import {JwtAuthGuard} from "./jwt-auth.guard";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Вход'})
    @ApiResponse({status: 200})
    @Post('/login')
    login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto)
    }

    @ApiOperation({summary: 'Регистрация'})
    @ApiResponse({status: 200})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto)
    }
    // @ApiOperation({summary: 'Выход'})
    // @ApiResponse({status: 200})
    // @UseGuards(JwtAuthGuard)
    // @Post('/logout')
    // loguot(@Body() context: ExecutionContext) {
    //     return this.authService.logout(context)
    // }
}
