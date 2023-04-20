import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {Client} from "./clients.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateClientDto} from "./dto/create-client.dto";
import {RolesService} from "../roles/roles.service";
import {User} from "../users/users.model";
import {Employee} from "../employees/employees.model";

@Injectable()//провайдер для внедрения в controller
export class ClientsService {

    constructor(@InjectModel(User) private readonly userRepository: typeof User, @InjectModel(Employee) private readonly employeeRepository: typeof Employee,
        @InjectModel(Client) private clientRepository: typeof Client) {}

    async createClient(dto: CreateClientDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const employee = await this.employeeRepository.findByPk(dto.userId);
        const client = await this.clientRepository.create(dto);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        if (employee) {
            throw new NotFoundException('Пользователь является сотрудником');
        }

        // Создаем сотрудника и возвращаем результат
        return client;
    }

    async getAllClients() {
        const clients = await this.clientRepository.findAll({include: {all: true}});
        return clients;
    }
}
