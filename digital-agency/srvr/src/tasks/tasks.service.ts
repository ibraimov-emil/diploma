import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {UpdateTaskDto} from "./dto/update-task.dto";
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './tasks.model';

@Injectable()//провайдер для внедрения в controller
export class TasksService {

    constructor(@InjectModel(Task) private readonly tasksRepository: typeof Task) {}

    async create(dto: CreateTaskDto) {
        const task = await this.tasksRepository.create(dto);
        return task;
    }

    async getAll() {
        const tasks = await this.tasksRepository.findAll({include: {all: true}});
        return tasks;
    }

    async findOneById(id: number): Promise<Task> {
        const task = await this.tasksRepository.findOne({where: {id}, include: {all: true}});
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return task;
    }

    async update(id: number, dto: UpdateTaskDto) {
        const task = await this.tasksRepository.findByPk(id);
        if (!task){
            throw new HttpException('Задача не найдена', HttpStatus.NOT_FOUND);
        }
        await this.tasksRepository.update(dto, {where: {id}})
        return dto;
    }

    async getById(id: number) {
        return this.tasksRepository.findByPk(id);
    }

    async deleteById(id: number): Promise<{ message: string }> {
        const task = await this.tasksRepository.findByPk(id);
        if (!task) {
            throw new Error('Задача не найдеан');
        }
        await task.destroy();
        return { message: `Задача успешно удалена` };
    }
}
