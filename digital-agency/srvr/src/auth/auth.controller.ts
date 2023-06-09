import {Body, Controller, ExecutionContext, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {AuthService} from "./auth.service";
import {Request, Response} from 'express';
import { CreateClientRequestDto } from './dto/create-client-request.dto';


@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: 'Вход'})
    @ApiResponse({status: 200})
    @Post('/login')
    login(@Body() userDto: LoginUserDto)
    {
        return this.authService.login(userDto)
    }

    @ApiOperation({summary: 'Регистрация'})
    @ApiResponse({status: 200})
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto)
    }

    @ApiOperation({summary: 'Регистрация клиента с подачей заявки'})
    @ApiResponse({status: 200})
    @Post('/registrationclient')
    registrationClient(@Body() userClientDto: CreateClientRequestDto) {
        return this.authService.registrationClient(userClientDto)
    }

    @ApiOperation({summary: 'Выход'})
    @ApiResponse({status: 200})
    @Get('/logout')
    loguot(@Req() req: Request) {
        const { userId} = req.cookies;
        // console.log(req.cookies)
        this.authService.logout(userId);
    }

    // @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        const { userId } = req.cookies;
        const { refreshToken } = req.cookies;
        // console.log(refreshToken)
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
