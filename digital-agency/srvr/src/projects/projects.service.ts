import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import { Project } from './projects.model';
import { CreateProjectDto } from './dto/create-project.dto';
import {UpdateProjectDto} from "./dto/update-project.dto";

@Injectable()//провайдер для внедрения в controller
export class ProjectsService {

    constructor(@InjectModel(Project) private readonly projectsRepository: typeof Project) {}

    async createProject(dto: CreateProjectDto) {
        const project = await this.projectsRepository.create(dto);
        return project;
    }

    async getAllProjects() {
        const projects = await this.projectsRepository.findAll({include: {all: true}});
        return projects;
    }

    // async getProjectById(userId: number) {
    //     const project = await this.projectsRepository.findOne({where: {userId}});
    //     return project;
    // }

    async findOneById(id: number): Promise<Project> {
        console.log('project')
        const project = await this.projectsRepository.findOne({where: {id}, include: {all: true}});
        if (!project) {
            throw new NotFoundException(`Project with id ${id} not found`);
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
        const project = await this.projectsRepository.findByPk(id);
        if (!project){
            throw new HttpException('Проект не найден', HttpStatus.NOT_FOUND);
        }
        await this.projectsRepository.update(dto, {where: {id}})
        return dto;
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
        return { message: `Проект успешно удален` };
    }
}
