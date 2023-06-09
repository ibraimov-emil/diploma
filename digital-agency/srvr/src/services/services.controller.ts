import {Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {CreateServiceDto} from "./dto/create-service.dto";
import {ServicesService} from "./services.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Service} from "./services.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {UpdateServiceDto} from "./dto/update-service.dto";

@ApiTags('Услуги')
@Controller('services')
@ApiBearerAuth()
export class ServicesController {

    //инъекция чтобы использовать сервис
    constructor(private servicesService: ServicesService) {}

    @ApiOperation({summary: 'Добавление услуги'})
    @ApiResponse({status: 200, type: Service})
    @Post()
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    create(@Body() servicesDto: CreateServiceDto) {
        return this.servicesService.createService(servicesDto);
    }

    @ApiOperation({summary: 'Получить все услуги'})
    @ApiResponse({status: 200, type: [Service]})
    @Get()
    getAll() {
        return this.servicesService.getAllServices();
    }

    @ApiOperation({summary: 'Получить услугу по id'})
    @ApiResponse({status: 200, type: Service})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get('/:id')
    getByValue(@Param('id') id: number) {
        return this.servicesService.findOneById(id);
    }

    @ApiOperation({summary: 'Обновить услугу'})
    @ApiResponse({status: 200, type: Service})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateServiceDto: UpdateServiceDto): Promise<UpdateServiceDto> {
        return this.servicesService.updateService(+id, updateServiceDto);
    }
}
