import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Project} from './projects.model';
import {CreateProjectDto} from './dto/create-project.dto';
import {UpdateProjectDto} from "./dto/update-project.dto";
import {ChatParticipant} from "../chats/chat-participants.model";
import {Chat} from "../chats/chats.model";
import {EmployeesProjects} from "./employees-projects.model";

@Injectable()//провайдер для внедрения в controller
export class ProjectsService {

    constructor(
        @InjectModel(Project) private readonly projectsRepository: typeof Project,
        @InjectModel(EmployeesProjects) private readonly employeesProjectsRepository: typeof EmployeesProjects
    ) {
    }

    async createProject(dto: CreateProjectDto) {
        const { employeesIds, ...projectData } = dto;

        // Создание проекта
        const project = await this.projectsRepository.create(projectData);

        // Добавление сотрудников к проекту в таблицу EmployeesProjects
        if (employeesIds && employeesIds.length > 0) {
            const employeesProjectsData = employeesIds.map(employeeId => ({
                projectId: project.id,
                employeeId,
            }));
            await this.employeesProjectsRepository.bulkCreate(employeesProjectsData);
        }

        return project;
    }

    async getAllProjects() {
        const projects = await this.projectsRepository.findAll({
            include: {all: true},
            order: [['createdAt', 'DESC']] // Сортировка по полю createdAt в порядке убывания
        });
        return projects;
    }

    async getMyProjects(clientId: number) {
        if (clientId) {
            const projects = this.projectsRepository.findAll({
                where: {clientId},
                include: {all: true}
            });
            console.log(projects)
            if (!projects) {
                throw new NotFoundException(`У пользователя нет проектов`);
            }
            return projects
        }
        throw new NotFoundException(`Пользователь не является клиентом`);
    }

    // async getProjectById(userId: number) {
    //     const project = await this.projectsRepository.findOne({where: {userId}});
    //     return project;
    // }

    async findOneById(id: number): Promise<Project> {
        // Находим проект по идентификатору
        const project = await this.projectsRepository.findOne({
            where: { id },
            include: { all: true }
        });

        // Если проект не найден, выбрасываем ошибку
        if (!project) {
            throw new NotFoundException(`Project with id ${id} not found`);
        }

        // Получаем связанные записи из таблицы employeesProjectsRepository по идентификатору проекта
        const employeesProjects = await this.employeesProjectsRepository.findAll({
            where: { projectId: id }
        });

        // Извлекаем идентификаторы сотрудников
        const employeesIds = employeesProjects.map(ep => ep.employeeId);

        // Добавляем идентификаторы сотрудников к объекту проекта
        // @ts-ignore
        project.setDataValue('employeesIds', employeesIds);

        // Возвращаем объект проекта
        return project;
    }

    async findOneMyById(id: number, clientId: number): Promise<Project> {
        console.log('project')
        const project = await this.projectsRepository.findOne({where: {id, clientId}, include: {all: true}});
        if (!project) {
            throw new NotFoundException(`Вы не являетесь участником проекта`);
        }
        return project;
    }

    // async update(id: number, dto: UpdateProjectDto) {
    //     const project = await this.projectsRepository.findByPk(id);
    //     if (!project){
    //         throw new HttpException('Заявка не найдена', HttpStatus.NOT_FOUND);
    //     }
    //     await this.projectsRepository.update({ dto }, { where: { id } })
    //     return this.getById(id);
    // }

    async updateProject(id: number, dto: UpdateProjectDto) {
        // Проверка наличия проекта
        const project = await this.projectsRepository.findByPk(id);
        if (!project) {
            throw new HttpException('Проект не найден', HttpStatus.NOT_FOUND);
        }

        // Обновление проекта
        await project.update(dto);

        // Обновление связанных записей в таблице EmployeesProjects, если переданы новые идентификаторы сотрудников
        if (dto.employeesIds && dto.employeesIds.length > 0) {
            // Удаление связей сотрудников для текущего проекта
            await this.employeesProjectsRepository.destroy({ where: { projectId: id } });

            // Создание новых связей сотрудников для проекта
            const employeesProjectsData = dto.employeesIds.map(employeeId => ({
                projectId: id,
                employeeId,
            }));
            await this.employeesProjectsRepository.bulkCreate(employeesProjectsData);
        }

        // Возвращаем обновленный проект
        return project;
    }

    async getById(id: number) {
        return this.projectsRepository.findByPk(id);
    }

    async deleteProjectById(id: number): Promise<{ message: string }> {
        const project = await this.projectsRepository.findByPk(id);
        if (!project) {
            throw new Error('Проект не найден');
        }
        await project.destroy();
        return {message: `Проект успешно удален`};
    }
}
