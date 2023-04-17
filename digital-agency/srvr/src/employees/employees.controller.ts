import {Body, Controller, Get, Post, UseGuards, UsePipes} from '@nestjs/common';
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {EmployeesService} from "./employees.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Employee} from "./employees.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";

@ApiTags('Сотрудники')
@Controller('employees')
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
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.employeesService.addRole(dto);
    }
}
