import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import {FilesService} from "../files/files.service";

@Injectable()//провайдер для внедрения в controller
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private fileService: FilesService
                ) {}

    async createUser(dto: CreateUserDto) {
        const candidate = await this.getUserByEmail(dto.email);
        if (candidate) {
            throw new HttpException(
                "Пользователь с таким email существует",
                HttpStatus.BAD_REQUEST
            );
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userRepository.create({
            ...dto,
            password: hashPassword,
        });
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({attributes: ['id', 'name', 'email', 'surname', 'phone']});
        return users;
    }

    async getUserByEmail(email: string) {
        try {
            // Try first with only essential attributes
            const user = await this.userRepository.findOne({
                where: {email},
                attributes: ['id', 'name', 'surname', 'email', 'phone', 'password'],
                include: ['employee', 'client']
            });
            return user;
        } catch (error) {
            console.error('Error finding user by email:', error);
            // Fallback to a more basic query if the full one fails
            return this.userRepository.findOne({
                where: {email}
            });
        }
    }

    async findById(id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: {id},
                attributes: ['id', 'name', 'surname', 'email', 'phone', 'password'],
                include: ['employee', 'client']
            });
            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`);
            }
            return user;
        } catch (error) {
            console.error('Error finding user by id:', error);
            const basicUser = await this.userRepository.findByPk(id);
            if (!basicUser) {
                throw new NotFoundException(`User with id ${id} not found`);
            }
            return basicUser;
        }
    }

    async updateUser(id: number, dto: UpdateUserDto): Promise<UpdateUserDto> {
        const user = await this.userRepository.findByPk(id);
        if (!user){
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.update(dto, {where: {id}})
        const updatedUser  = await this.userRepository.findByPk(id);
        return updatedUser;
    }

    async updateAvatar(id: number, image: any) {
        const fileName = await this.fileService.createFile(image);
        const user = await this.userRepository.update({avatar: fileName}, {where: {id}})
        return user;
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
