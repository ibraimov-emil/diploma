import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {Service} from "../services/services.model";
import {TasksService} from "./tasks.service";
import {Task} from "./tasks.model";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskDto} from "./dto/update-task.dto";


@ApiTags('Задачи')
@Controller('tasks')
@ApiBearerAuth()
export class TasksController {

    //инъекция чтобы использовать сервис
    constructor(private tasksService: TasksService) {}

    @ApiOperation({summary: 'Создать задачу'})
    @ApiResponse({status: 200, type: Task})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() taskDto: CreateTaskDto) {
        return this.tasksService.create(taskDto);
    }

    @ApiOperation({summary: 'Получить все задачи'})
    @ApiResponse({status: 200, type: [Task]})
    @Roles("ADMIN", "Manager")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.tasksService.getAll();
    }

    @ApiOperation({summary: 'Получить задачу по id'})
    @ApiResponse({status: 200, type: Task})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/:id')
    getByValue(@Param('id') id: number) {   
        return this.tasksService.findOneById(id);
    }

    @ApiOperation({summary: 'Обновить задачу'})
    @ApiResponse({status: 200, type: Service})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @ApiOperation({summary: 'Удалить задачу по id'})
    @ApiResponse({status: 200, type: Task})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Promise<{ message: string }> {
        return this.tasksService.deleteById(id);
    }

}
