import {Body, Controller, Get, Param, Patch, Post, Put, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {BanUserDto} from "./dto/ban-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UserId} from "../decorators/user-id.decorator";
import {RefreshTokenGuard} from "../common/guards/refreshToken.guard";
import {AccessTokenGuard} from "../common/guards/accessToken.guard";

@ApiTags('Пользователи')
@Controller('users')
@ApiBearerAuth()
export class UsersController {

    //инъекция чтобы использовать сервис
    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse(   {status: 200, type: User})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(AccessTokenGuard)
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({summary: 'Получить id пользователя'})
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/me')
    getMe(@UserId() id: number) {
        return this.usersService.findById(id);
    }

    @ApiOperation({summary: 'Получить пользователя по Id'})
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/:id')
    getByValue(@Param('id') id: number) {
        return this.usersService.findById(id);
    }

    @ApiOperation({summary: 'Обновить пользователя'})
    @ApiResponse({status: 200, type: User})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
        return this.usersService.updateUser(+id, updateUserDto);
    }

    @ApiOperation({summary: 'Забанить пользователя'})
    @ApiResponse({status: 200})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/ban')
    ban(@Body() dto: BanUserDto) {
        return this.usersService.ban(dto);
    }
}

