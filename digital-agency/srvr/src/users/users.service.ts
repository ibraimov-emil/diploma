import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()//провайдер для внедрения в controller
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        // await user.$set('employee', [employee.id])
        // user.employee = [employee]
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }

    async updateUser(id: number, dto: UpdateUserDto): Promise<UpdateUserDto> {
        await this.userRepository.update(dto, {where: {id}})
        // const user = await this.userRepository.findOne({where: {id}, include: {all: true}})
        // const user = await this.userRepository.findOne({where: {id}, include: {all: true}})
        // if (!user) {
        //     throw new NotFoundException(`Model with ID ${id} not found.`);
        // }
        // const updatedModel = Object.assign(user, updateDto);
        // return this.save(updatedModel);
        // const user = await this.userRepository.update({where: {id}}, dto)
        return dto;
    }

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }
}
