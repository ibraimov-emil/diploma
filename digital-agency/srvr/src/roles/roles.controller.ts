import {Body, Controller, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UpdateEmployeeDto} from "../employees/dto/update-employee.dto";
import {UpdateRoleDto} from "./dto/update-employee.dto";

@ApiTags('Роли')
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
    constructor(private roleService: RolesService) {}

    @ApiOperation({summary: 'Создание роли'})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @ApiOperation({summary: 'Получить все роли'})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAllRoles() {
        return this.roleService.getAllRoles();
    }
    @ApiOperation({summary: 'Получить роль по значению'})
    @ApiResponse({status: 200, type: Role})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/:value')
    getByValue(@Param('value') value: string) {
        return this.roleService.getRoleByValue(value);
    }

    @ApiOperation({summary: 'Обновить значение роли'})
    @ApiResponse({status: 200, type: User})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':value')
    update(@Param('value') value: string, @Body() updateRoleDto: UpdateRoleDto): Promise<UpdateRoleDto> {
        return this.roleService.update(value, updateRoleDto);
    }
}
