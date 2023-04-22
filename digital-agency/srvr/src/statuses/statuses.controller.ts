import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';

import {StatusesService} from "./statuses.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Status} from "./statuses.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {UpdateStatusDto} from "./dto/update-status.dto";
import {CreateStatusDto} from "./dto/create-status.dto";

@ApiTags('Статусы')
@Controller('statuses')
export class StatusesController {

    //инъекция чтобы использовать сервис
    constructor(private statusesService: StatusesService) {}

    @ApiOperation({summary: 'Добавление статуса'})
    @ApiResponse({status: 200, type: Status})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() statusDto: CreateStatusDto) {
        return this.statusesService.createStatus(statusDto);
    }

    @ApiOperation({summary: 'Получить все статусы'})
    @ApiResponse({status: 200, type: [Status]})
    @Roles("ADMIN", "Manager")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.statusesService.getAllStatuses();
    }

    @ApiOperation({summary: 'Получить статус по id'})
    @ApiResponse({status: 200, type: Status})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/:id')
    getByValue(@Param('id') id: number) {
        return this.statusesService.findOneById(id);
    }

    @ApiOperation({summary: 'Обновить статус по id'})
    @ApiResponse({status: 200, type: Status})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateStatusDto: UpdateStatusDto): Promise<UpdateStatusDto> {
        return this.statusesService.updateStatus(+id, updateStatusDto);
    }

    @ApiOperation({summary: 'Удалить статус по id'})
    @ApiResponse({status: 200, type: Status})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Promise<{ message: string }> {
        return this.statusesService.deleteStatusById(id);
    }

}
