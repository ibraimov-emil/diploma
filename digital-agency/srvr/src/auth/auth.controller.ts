import {Body, Controller, ExecutionContext, Get, Headers, HttpException, HttpStatus, Logger, Post, Req, Res, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {LoginUserDto} from "../users/dto/login-user.dto";
import {AuthService} from "./auth.service";
import {Request, Response} from 'express';
import { CreateClientRequestDto } from './dto/create-client-request.dto';


@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

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
    logout(@Req() req: Request) {
        try {
            const { userId } = req.cookies;
            if (!userId) {
                throw new HttpException('User ID not found in cookies', HttpStatus.BAD_REQUEST);
            }
            return this.authService.logout(userId);
        } catch (error) {
            this.logger.error(`Logout error: ${error.message}`);
            throw new HttpException(
                'Failed to logout',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @ApiOperation({summary: 'Обновление токена - старый метод'})
    @ApiResponse({status: 200})
    @Get('refresh')
    refreshTokens(@Req() req: Request, @Headers('authorization') authHeader: string) {
        try {
            // First try to get from cookies
            let userId = req.cookies?.userId;
            let refreshToken = req.cookies?.refreshToken;

            this.logger.log(`Refresh token request - Cookie data: userId=${userId}, hasRefreshToken=${!!refreshToken}`);
            
            // If not in cookies, try to get from Authorization header
            if (authHeader) {
                // Authorization header might contain access token, not refresh token
                // So we'll log it for debugging
                this.logger.log(`Found Authorization header: ${authHeader.substring(0, 15)}...`);
                
                if (!refreshToken) {
                    refreshToken = authHeader.replace('Bearer ', '').trim();
                    this.logger.log(`Using token from Authorization header as refresh token`);
                }
            }

            // If we have a token but no userId, try to extract from the token
            if (refreshToken && !userId) {
                try {
                    // Extract user ID from token if possible
                    const tokenParts = refreshToken.split('.');
                    if (tokenParts.length !== 3) {
                        throw new Error('Invalid JWT format');
                    }
                    
                    const payloadBase64 = tokenParts[1];
                    const decodedPayload = Buffer.from(payloadBase64, 'base64').toString();
                    const tokenData = JSON.parse(decodedPayload);
                    
                    userId = tokenData.sub || tokenData.id;
                    this.logger.log(`Extracted user ID from token: ${userId}`);
                } catch (err) {
                    this.logger.error(`Failed to extract userId from token: ${err.message}`);
                }
            }

            if (!userId || !refreshToken) {
                this.logger.error('Missing required data', { userId: !!userId, refreshToken: !!refreshToken });
                throw new HttpException('User ID or refresh token missing', HttpStatus.UNAUTHORIZED);
            }

            return this.authService.refreshTokens(userId, refreshToken);
        } catch (error) {
            this.logger.error(`Refresh token error: ${error.message}`);
            throw new HttpException(
                error.message || 'Failed to refresh token',
                error.status || HttpStatus.UNAUTHORIZED
            );
        }
    }
    
    @ApiOperation({summary: 'Обновление токена по Bearer заголовку'})
    @ApiResponse({status: 200})
    @Post('token/refresh')
    refreshTokensSimple(@Headers('authorization') authHeader: string) {
        try {
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                this.logger.error('No or invalid Authorization header');
                throw new HttpException('Authorization header with Bearer token required', HttpStatus.UNAUTHORIZED);
            }
            
            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            
            try {
                // Decode token to get user ID
                const tokenParts = token.split('.');
                if (tokenParts.length !== 3) {
                    throw new Error('Invalid JWT format');
                }
                
                const payloadBase64 = tokenParts[1];
                const decodedPayload = Buffer.from(payloadBase64, 'base64').toString();
                const tokenData = JSON.parse(decodedPayload);
                
                const userId = tokenData.sub || tokenData.id;
                if (!userId) {
                    throw new Error('User ID not found in token');
                }
                
                this.logger.log(`Processing refresh request for user ID: ${userId}`);
                return this.authService.refreshTokens(userId, token);
            } catch (err) {
                this.logger.error(`Token decode error: ${err.message}`);
                throw new HttpException('Invalid token format', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            this.logger.error(`Refresh token error: ${error.message}`);
            throw new HttpException(
                error.message || 'Failed to refresh token',
                error.status || HttpStatus.UNAUTHORIZED
            );
        }
    }
}
