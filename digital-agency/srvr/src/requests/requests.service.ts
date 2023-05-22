import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {RequestTable} from "./requests.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateRequestDto} from "./dto/create-request.dto";
import {UpdateRequestDto} from "./dto/update-request.dto";
import {UpdateServiceDto} from "../services/dto/update-service.dto";

@Injectable()//провайдер для внедрения в controller
export class RequestsService {

    constructor(@InjectModel(RequestTable) private readonly requestRepository: typeof RequestTable) {}

    async createRequest(dto: CreateRequestDto) {
        const request = await this.requestRepository.create(dto);
        return request;
    }

    async getAllRequests() {
        const requests = await this.requestRepository.findAll({include: {all: true}});
        return requests;
    }

    // async getRequestById(userId: number) {
    //     const request = await this.requestRepository.findOne({where: {userId}});
    //     return request;
    // }

    async findOneById(id: number): Promise<RequestTable> {
        console.log('request')
        const request = await this.requestRepository.findOne({where: {id}, include: {all: true}});;

        if (!request) {
            throw new NotFoundException(`Request with id ${id} not found`);
        }
        return request;
    }

    // async update(id: number, dto: UpdateRequestDto) {
    //     const request = await this.requestRepository.findByPk(id);
    //     if (!request){
    //         throw new HttpException('Заявка не найдена', HttpStatus.NOT_FOUND);
    //     }
    //     await this.requestRepository.update({ dto }, { where: { id } })
    //     return this.getById(id);
    // }

    async updateRequest(id: number, dto: UpdateRequestDto) {
        const request = await this.requestRepository.findByPk(id);
        if (!request){
            throw new HttpException('Заявка не найдена', HttpStatus.NOT_FOUND);
        }
        await this.requestRepository.update(dto, {where: {id}})
        return dto;
    }

    async getById(id: number) {
        return this.requestRepository.findByPk(id);
    }

    async deleteRequestById(id: number): Promise<{ message: string }> {
        const request = await this.requestRepository.findByPk(id);
        if (!request) {
            throw new Error('Заявка не найдена');
        }
        await request.destroy();
        return { message: `Заявка успешно удалена` };
    }
}
