import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {Service} from "./services.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateServiceDto} from "./dto/create-service.dto";
import {UpdateServiceDto} from "./dto/update-service.dto";

@Injectable()//провайдер для внедрения в controller
export class ServicesService {

    constructor(@InjectModel(Service) private readonly serviceRepository: typeof Service) {}

    async createService(dto: CreateServiceDto) {

        const service = await this.serviceRepository.create(dto);

        // Создаем услугу и возвращаем результат
        return service;
    }

    async getAllServices() {
        const services = await this.serviceRepository.findAll({include: {all: true}});
        return services;
    }

    async findOneById(id: number): Promise<Service> {
        console.log('service')
        const service = await this.serviceRepository.findByPk(id);

        if (!service) {
            throw new NotFoundException(`Service with id ${id} not found`);
        }
        return service;
    }

    async updateService(id: number, dto: UpdateServiceDto): Promise<UpdateServiceDto> {
        const service = await this.serviceRepository.findByPk(id);
        if (!service){
            throw new HttpException('Услуга не найдена', HttpStatus.NOT_FOUND);
        }
        await this.serviceRepository.update(dto, {where: {id}})
        return dto;
    }
}
