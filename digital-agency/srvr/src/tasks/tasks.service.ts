import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {UpdateTaskDto} from "./dto/update-task.dto";
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './tasks.model';
import {EmployeesTasks} from "./employees-tasks.model";

@Injectable()//провайдер для внедрения в controller
export class TasksService {

    constructor(
        @InjectModel(Task) private readonly tasksRepository: typeof Task,
        @InjectModel(EmployeesTasks) private readonly employeesTasksRepository: typeof EmployeesTasks
    ) {}

    async create(dto: CreateTaskDto) {
        const { employeesIds, ...taskData } = dto;
        const task = await this.tasksRepository.create(taskData);
        // Добавление сотрудников к проекту в таблицу EmployeesProjects
        if (employeesIds && employeesIds.length > 0) {
            const employeesProjectsData = employeesIds.map(employeeId => ({
                taskId: task.id,
                employeeId,
            }));
            await this.employeesTasksRepository.bulkCreate(employeesProjectsData);
        }
        return task;
    }

    async getAll() {
        const tasks = await this.tasksRepository.findAll({include: {all: true}});
        return tasks;
    }

    async findOneById(id: number): Promise<Task> {
        const task = await this.tasksRepository.findOne({where: {id}, include: {all: true}});
        // Получаем связанные записи из таблицы employeesProjectsRepository по идентификатору проекта
        const employeesProjects = await this.employeesTasksRepository.findAll({
            where: { taskId: id }
        });

        // Извлекаем идентификаторы сотрудников
        const employeesIds = employeesProjects.map(ep => ep.employeeId);

        // Добавляем идентификаторы сотрудников к объекту проекта
        // @ts-ignore
        task.setDataValue('employeesIds', employeesIds);
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
