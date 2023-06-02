import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {RequestTable} from "./requests.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateRequestDto} from "./dto/create-request.dto";
import {UpdateRequestDto} from "./dto/update-request.dto";
import {UpdateServiceDto} from "../services/dto/update-service.dto";
import {Project} from "../projects/projects.model";

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

    async getMyRequests(clientId: number){
        if (clientId){
            const projects =  this.requestRepository.findAll({
                where: { clientId },
                include: {all: true}
            });
            console.log(projects)
            if (!projects) {
                throw new NotFoundException(`У пользователя нет заявок`);
            }
            return projects
        }
        throw new NotFoundException(`Пользователь не является клиентом`);
    }

    async findOneById(id: number): Promise<RequestTable> {
        console.log('request')
        const request = await this.requestRepository.findOne({where: {id}, include: {all: true}});;

        if (!request) {
            throw new NotFoundException(`Request with id ${id} not found`);
        }
        return request;
    }

    async findOneMyById(id: number, clientId: number): Promise<RequestTable> {
        console.log('project')
        const request = await this.requestRepository.findOne({where: {id, clientId}, include: {all: true}});
        if (!request) {
            throw new NotFoundException(`Вам не принадлежит данная заявка`);
        }
        return request;
    }


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
