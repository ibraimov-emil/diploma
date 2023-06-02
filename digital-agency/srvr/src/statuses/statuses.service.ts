import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {Status} from "./statuses.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateStatusDto} from "./dto/create-status.dto";
import {UpdateStatusDto} from "./dto/update-status.dto";

@Injectable()//провайдер для внедрения в controller
export class StatusesService {

    constructor(@InjectModel(Status) private readonly statusRepository: typeof Status) {}

    async createStatus(dto: CreateStatusDto) {

        const status = await this.statusRepository.create(dto);

        // Создаем услугу и возвращаем результат
        return status;
    }

    async getAllStatuses() {
        const statuses = await this.statusRepository.findAll({include: {all: true}});
        return statuses;
    }

    async findOneById(id: number): Promise<Status> {
        console.log('status')
        const status = await this.statusRepository.findByPk(id);

        if (!status) {
            throw new NotFoundException(`Status with id ${id} not found`);
        }
        return status;
    }

    async updateStatus(id: number, dto: UpdateStatusDto): Promise<UpdateStatusDto> {
        const status = await this.statusRepository.findByPk(id);
        if (!status){
            throw new HttpException('Услуга не найдена', HttpStatus.NOT_FOUND);
        }
        await this.statusRepository.update(dto, {where: {id}})
        return dto;
    }

    async deleteStatusById(id: number): Promise<{ message: string }> {
        const status = await this.statusRepository.findOne({ where: { id } });
        if (!status) {
            throw new Error('Статус не найден');
        }
        await status.destroy();
        return { message: `Статус успешно удален` };
    }
}
