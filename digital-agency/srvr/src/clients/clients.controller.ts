import {Body, Controller, Get, Post, UseGuards, UsePipes} from '@nestjs/common';
import {CreateClientDto} from "./dto/create-client.dto";
import {ClientsService} from "./clients.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Client} from "./clients.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";

@ApiTags('Клиенты')
@Controller('clients')
export class ClientsController {

    //инъекция чтобы использовать сервис
    constructor(private ClientsService: ClientsService) {}

    @ApiOperation({summary: 'Добавление клиента'})
    @ApiResponse({status: 200, type: Client})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() ClientDto: CreateClientDto) {
        return this.ClientsService.createClient(ClientDto);
    }

    @ApiOperation({summary: 'Получить всех клиентов'})
    @ApiResponse({status: 200, type: [Client]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.ClientsService.getAllClients();
    }

    @ApiOperation({summary: 'Получить всех клиентов'})
    @ApiResponse({status: 200, type: [Client]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    update() {
        return this.ClientsService.getAllClients();
    }
    
}
