import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {Service} from "../services/services.model";
import {UpdateProjectDto} from "./dto/update-project.dto";
import {Project} from "./projects.model";
import {ProjectsService} from "./projects.service";
import {CreateProjectDto} from "./dto/create-project.dto";

@ApiTags('Проекты')
@Controller('projects')
@ApiBearerAuth()
export class ProjectsController {

    //инъекция чтобы использовать сервис
    constructor(private projectsService: ProjectsService) {}

    @ApiOperation({summary: 'Создать проект'})
    @ApiResponse({status: 200, type: Project})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() projectDto: CreateProjectDto) {
        return this.projectsService.createProject(projectDto);
    }

    @ApiOperation({summary: 'Получить все проекты'})
    @ApiResponse({status: 200, type: [Project]})
    @Roles("ADMIN", "Manager")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.projectsService.getAllProjects();
    }

    @ApiOperation({summary: 'Получить проект по id'})
    @ApiResponse({status: 200, type: Project})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/:id')
    getByValue(@Param('id') id: number) {   
        return this.projectsService.findOneById(id);
    }

    @ApiOperation({summary: 'Обновить проект'})
    @ApiResponse({status: 200, type: Service})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectsService.updateProject(id, updateProjectDto);
    }

    @ApiOperation({summary: 'Удалить проект по id'})
    @ApiResponse({status: 200, type: Project})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Promise<{ message: string }> {
        return this.projectsService.deleteProjectById(id);
    }

}
