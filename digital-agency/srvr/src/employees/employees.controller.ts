import {Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {EmployeesService} from "./employees.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Employee} from "./employees.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {Role} from "../roles/roles.model";
import {User} from "../users/users.model";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";

@ApiTags('Сотрудники')
@Controller('employees')
@ApiBearerAuth()
export class EmployeesController {

    //инъекция чтобы использовать сервис
    constructor(private employeesService: EmployeesService) {}

    @ApiOperation({summary: 'Добавление сотрудника'})
    @ApiResponse({status: 200, type: Employee})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() employeeDto: CreateEmployeeDto) {
        return this.employeesService.createEmployee(employeeDto);
    }

    @ApiOperation({summary: 'Получить всех сотрудников'})
    @ApiResponse({status: 200, type: [Employee]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.employeesService.getAllEmployees();
    }
    
    @ApiOperation({summary: 'Выдать роль'})
    @ApiResponse({status: 200})
    // @Roles("ADMIN")
    // @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.employeesService.addRole(dto);
    }

    @ApiOperation({summary: 'Получить сотрудника по id'})
    @ApiResponse({status: 200, type: Role})
    // @Roles("ADMIN")
    // @UseGuards(RolesGuard)
    @Get('/:userId')
    getByValue(@Param('userId') userId: number) {
        return this.employeesService.getEmployeeById(userId);
    }

    @ApiOperation({summary: 'Обновить пользователя'})
    @ApiResponse({status: 200, type: User})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<UpdateEmployeeDto> {
        return this.employeesService.updateEmployee(+id, updateEmployeeDto);
    }
}
