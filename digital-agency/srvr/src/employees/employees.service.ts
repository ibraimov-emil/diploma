import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {Employee} from "./employees.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {User} from "../users/users.model";
import {Client} from "../clients/clients.model";
import {Role} from "../roles/roles.model";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {AddProjectDto} from "./dto/add-project.dto";
import {ProjectsService} from "../projects/projects.service";

@Injectable()//провайдер для внедрения в controller
export class EmployeesService {

    constructor(@InjectModel(User) private readonly userRepository: typeof User, @InjectModel(Client) private readonly clientRepository: typeof Client,
        @InjectModel(Employee) private employeeRepository: typeof Employee, private roleService: RolesService, private projectService: ProjectsService) {}

    async createEmployee(dto: CreateEmployeeDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const client = await this.clientRepository.findByPk(dto.userId);
        if (client) {
            throw new NotFoundException('Пользователь является клиентом');
        }
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const employee = await this.employeeRepository.create(dto);

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

    async addProject(dto: AddProjectDto) {
        const employee = await this.employeeRepository.findByPk(dto.employeeId);
        const project = await this.projectService.findOneById(dto.projectId);
        if (project && employee) {
            await employee.$add('project', project.id);
            return dto;
        }
        throw new HttpException('Сотрудник или проект не найдены', HttpStatus.NOT_FOUND);
    }

    //проверка: является ли пользователь сотдруником
    async getEmployeeById(userId: number) {
        console.log('employee')
        const employee = await this.employeeRepository.findOne({where: {userId}});
        // console.log(employee)
        return employee;
    }

    async findOneById(id: number): Promise<Employee> {
        const employee = await this.employeeRepository.findByPk(id, { include: Role });
        if (!employee) {
            throw new NotFoundException(`Employee with id ${id} not found`);
        }
        return employee;
    }

    async updateEmployee(id: number, dto: UpdateEmployeeDto): Promise<UpdateEmployeeDto> {
        const employee = await this.userRepository.findByPk(id);
        if (!employee){
            throw new HttpException('Сотрудник не найден', HttpStatus.NOT_FOUND);
        }
        await this.employeeRepository.update(dto, {where: {id}})
        return dto;
    }
}
