import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {Service} from "../services/services.model";

import { Stage } from './stage.model';
import {StagesService} from "./stage.service";
import {CreateStageDto} from "./dto/create-stage.dto";
import {UpdateStageDto} from "./dto/update-stage.dto";

@ApiTags('Этапы')
@Controller('stages')
@ApiBearerAuth()
export class StagesController {

    //инъекция чтобы использовать сервис
    constructor(private stagesService: StagesService) {}

    @ApiOperation({summary: 'Добавление этапа'})
    @ApiResponse({status: 200, type: Stage})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() requestDto: CreateStageDto) {
        return this.stagesService.createStage(requestDto);
    }

    @ApiOperation({summary: 'Получить все этапы'})
    @ApiResponse({status: 200, type: [Stage]})
    @Roles("ADMIN", "Manager")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.stagesService.getAllStages();
    }

    @ApiOperation({summary: 'Получить заявку по id'})
    @ApiResponse({status: 200, type: Stage})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/:id')
    getByValue(@Param('id') id: number) {
        return this.stagesService.findOneById(id);
    }



    @ApiOperation({summary: 'Обновить этап'})
    @ApiResponse({status: 200, type: Stage})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateStageDto: UpdateStageDto) {
        return this.stagesService.updateStage(id, updateStageDto);
    }

    @ApiOperation({summary: 'Удалить этап по id'})
    @ApiResponse({status: 200, type: Stage})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Promise<{ message: string }> {
        return this.stagesService.deleteStageById(id);
    }

}
