import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';

import {InjectModel} from "@nestjs/sequelize";

import {UpdateServiceDto} from "../services/dto/update-service.dto";
import {Stage} from "./stage.model";
import {CreateStageDto} from "./dto/create-stage.dto";
import {UpdateStageDto} from "./dto/update-stage.dto";

@Injectable()//провайдер для внедрения в controller
export class StagesService {

    constructor(@InjectModel(Stage) private readonly stageRepository: typeof Stage) {}

    async createStage(dto: CreateStageDto){
        const stage = await this.stageRepository.create(dto);
        return stage;
    }

    async getAllStages(){
        const stages = await this.stageRepository.findAll({include: {all: true}});
        return stages;
    }

    // async getStageById(userId: number) {
    //     const stage = await this.stageRepository.findOne({where: {userId}});
    //     return stage;
    // }

    async findOneById(id: number): Promise<Stage> {
        console.log('stage')
        const stage = await this.stageRepository.findByPk(id);

        if (!stage) {
            throw new NotFoundException(`Stage with id ${id} not found`);
        }
        return stage;
    }

    async updateStage(id: number, dto: UpdateStageDto) {
        const stage = await this.stageRepository.findByPk(id);
        if (!stage){
            throw new HttpException('Заявка не найдена', HttpStatus.NOT_FOUND);
        }
        await this.stageRepository.update(dto, {where: {id}})
        return dto;
    }

    async getById(id: number) {
        return this.stageRepository.findByPk(id);
    }

    async deleteStageById(id: number): Promise<{ message: string }> {
        const stage = await this.stageRepository.findByPk(id);
        if (!stage) {
            throw new Error('Заявка не найдена');
        }
        await stage.destroy();
        return { message: `Заявка успешно удалена` };
    }
}
