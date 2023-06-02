import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RequestTable} from "./requests.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {CreateRequestDto} from "./dto/create-request.dto";
import {RequestsService} from "./requests.service";
import {Service} from "../services/services.model";
import {UpdateRequestDto} from "./dto/update-request.dto";
import {Project} from "../projects/projects.model";
import {AuthUser} from "../utils/decorators";
import {User} from "../users/users.model";

@ApiTags('Заявки')
@Controller('requests')
@ApiBearerAuth()
export class RequestsController {

    //инъекция чтобы использовать сервис
    constructor(private requestsService: RequestsService) {}

    @ApiOperation({summary: 'Добавление заявки'})
    @ApiResponse({status: 200, type: RequestTable})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() requestDto: CreateRequestDto) {
        return this.requestsService.createRequest(requestDto);
    }

    @ApiOperation({summary: 'Получить все заявки'})
    @ApiResponse({status: 200, type: [RequestTable]})
    @Roles("ADMIN", "Manager")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.requestsService.getAllRequests();
    }

    @ApiOperation({summary: 'Получить клиенту его заявки'})
    @ApiResponse({status: 200, type: [Project]})
    @Get('/myRequests')
    getMyProjects(@AuthUser() user: User) {
        return this.requestsService.getMyRequests(user.client.id);
    }

    @ApiOperation({summary: 'Получить заявку по id'})
    @ApiResponse({status: 200, type: RequestTable})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/:id')
    getByValue(@Param('id') id: number) {
        return this.requestsService.findOneById(id);
    }

    @ApiOperation({summary: 'Получить заявку по id клиенту'})
    @ApiResponse({status: 200, type: RequestTable})
    @Get('myRequest/:id')
    getByValueMy(@Param('id') id: number, @AuthUser() user: User) {
        return this.requestsService.findOneMyById(id, user.client.id);
    }

    @ApiOperation({summary: 'Обновить заявку'})
    @ApiResponse({status: 200, type: RequestTable})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateRequestDto: UpdateRequestDto) {
        return this.requestsService.updateRequest(id, updateRequestDto);
    }

    @ApiOperation({summary: 'Удалить заявку по id'})
    @ApiResponse({status: 200, type: RequestTable})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Promise<{ message: string }> {
        return this.requestsService.deleteRequestById(id);
    }

}
