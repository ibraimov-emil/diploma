import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {UpdateEmployeeDto} from "../employees/dto/update-employee.dto";
import {UpdateRoleDto} from "./dto/update-employee.dto";

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}});
        return role;
    }

    async getAllRoles() {
        const roles = await this.roleRepository.findAll({include: {all: true}});
        return roles;
    }

    async update(value: string, dto: UpdateRoleDto): Promise<UpdateRoleDto> {
        const role = await this.roleRepository.findOne({where: {value}});
        if (!role){
            throw new HttpException('Сотрудник не найден', HttpStatus.NOT_FOUND);
        }
        await this.roleRepository.update(dto, {where: {value}})
        return dto;
    }



}
