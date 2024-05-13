import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {StatsService} from "./stats.service";


@ApiTags('Статистика')
@Controller('stats')
@ApiBearerAuth()
export class StatsController {
    //инъекция чтобы использовать сервис
    constructor(private statsService: StatsService) {}

    @ApiOperation({summary: 'Получить все проекты'})
    @ApiResponse({status: 200})
    @Roles("ADMIN", "Manager")
    @UseGuards(RolesGuard)
    @Get('/counts')
    getAll() {
        return this.statsService.getCounts();
    }
}
