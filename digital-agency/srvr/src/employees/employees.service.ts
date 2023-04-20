import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {Employee} from "./employees.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";

@Injectable()//провайдер для внедрения в controller
export class EmployeesService {

    constructor(@InjectModel(User) private readonly userRepository: typeof User, @InjectModel(Client) private readonly clientRepository: typeof Client,
        @InjectModel(Employee) private employeeRepository: typeof Employee, private roleService: RolesService) {}

    async createEmployee(dto: CreateEmployeeDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        // const client = await this.clientRepository.findByPk(dto.userId);
        const employee = await this.employeeRepository.create(dto);
        const role = await this.roleService.getRoleByValue("ADMIN")
        await employee.$set('roles', [role.id])
        employee.roles = [role]

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        if (employee) {
            throw new NotFoundException('Пользователь является клиентом');
        }

        // Создаем сотрудника и возвращаем результат
        return employee;
    }

    async getAllEmployees() {
        const employees = await this.employeeRepository.findAll({include: {all: true}});
        return employees;
    }

    async addRole(dto: AddRoleDto) {
        const employee = await this.employeeRepository.findByPk(dto.employeeId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && employee) {
            await employee.$add('role', role.id);
            return dto;
        }
        throw new HttpException('Сотрудник или роль не найдены', HttpStatus.NOT_FOUND);
    }

    async getEmployeeById(id: number) {
        const employee = await this.employeeRepository.findOne({where: {id}});
        return employee;
    }

}
