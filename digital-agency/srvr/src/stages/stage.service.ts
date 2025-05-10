import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';

import {InjectModel} from "@nestjs/sequelize";

import {UpdateServiceDto} from "../services/dto/update-service.dto";
import {Stage} from "./stage.model";
import {CreateStageDto} from "./dto/create-stage.dto";
import {UpdateStageDto} from "./dto/update-stage.dto";
import {PaymentService} from "./payment.service";
import {ProjectsService} from "../projects/projects.service";
import {Task} from "../tasks/tasks.model";
import {Status} from "../statuses/statuses.model";

@Injectable()//провайдер для внедрения в controller
export class StagesService {

    constructor(@InjectModel(Stage) private readonly stageRepository: typeof Stage, private readonly paymentService: PaymentService, private readonly projectService: ProjectsService,) {}

    async createStage(dto: CreateStageDto){
        const stage = await this.stageRepository.create(dto);
        return stage;
    }

    async getAllStages(){
        const stages = await this.stageRepository.findAll({include: {all: true}});
        return stages;
    }

    async getPayedStages(){
        return  await this.stageRepository.findAll({where: {paymentStatus: 'succeeded'}, include: {all: true}});
    }

    async findOneById(id: number): Promise<any> {
        console.log('stage');
        const stage = await this.stageRepository.findOne({
            where: { id },
            include: [
                {
                    model: Task,
                    include: [{ model: Status, attributes: ['name'] }],
                },
            ],
        });

        const colors = {
            'В процессе': 'blue',
            'Завершён': 'green',
            'На рассмотрении': 'yellow',
        };

        if (!stage) {
            throw new NotFoundException(`Stage with id ${id} not found`);
        }

        // Преобразование данных для добавления statusValue и statusColor
        const transformedStage = {
            ...stage.toJSON(),
            tasks: stage.tasks.map(task => ({
                ...task.toJSON(),
                statusColor: task.status ? colors[task.status.name] : null,
            })),
        };

        return transformedStage;
    }

    async findOneMyById(id: number, clientId: number): Promise<Stage> {
        console.log('project')

        const stage = await this.stageRepository.findOne({where: {id}, include: {all: true}});

        const project = await this.projectService.findOneMyById( stage.projectId, clientId);
        if (!project) {
            throw new NotFoundException(`Вы не являетесь участником проекта`);
        }
        if (!stage) {
            throw new NotFoundException(`Вы не являетесь участником проекта`);
        }
        return stage;
    }

    async updateStage(id: number, dto: UpdateStageDto) {
        console.log('Updating stage with ID:', id, 'Data:', dto);
        
        const stage = await this.stageRepository.findByPk(id);
        if (!stage){
            throw new HttpException('Этап не найден', HttpStatus.NOT_FOUND);
        }
        
        // Ensure cost is properly handled as a number if provided
        let updatedDto = {...dto};
        if (updatedDto.cost !== undefined) {
            console.log('Setting cost:', updatedDto.cost, 'Type:', typeof updatedDto.cost);
            // Convert string to number if needed
            if (typeof updatedDto.cost === 'string') {
                updatedDto = {
                    ...updatedDto,
                    cost: parseFloat(updatedDto.cost)
                };
            }
        }
        
        await this.stageRepository.update(updatedDto, {where: {id}});
        
        // Get updated stage to return
        const updatedStage = await this.stageRepository.findByPk(id);
        console.log('Stage updated, new data:', updatedStage);
        
        return updatedStage;
    }

    async deleteStageById(id: number): Promise<{ message: string }> {
        const stage = await this.stageRepository.findByPk(id);
        if (!stage) {
            throw new Error('Этап не найдена');
        }
        await stage.destroy();
        return { message: `Этап успешно удален` };
    }

    async createPayment(stageId: number, client) {
        const stage = await this.findOneById(stageId);
        if (!stage) {
            throw new NotFoundException(`Этап не найден`);
        }

        if (!stage.cost) {
            throw new HttpException('Не задана стоимость этапа. Сначала установите стоимость в разделе "Выставление счета".', HttpStatus.BAD_REQUEST);
        }

        // If client exists, verify they are part of the project
        if (client) {
            const project = await this.projectService.findOneMyById(stage.projectId, client.id);
            if (!project) {
                throw new NotFoundException(`Вы не являетесь участником проекта`);
            }
        }

        const payment = await this.paymentService.createPayment(stage);
        await this.stageRepository.update(
            {
                ...stage, 
                paymentId: payment.paymentId, 
                paymentLink: payment.paymentLink
            }, 
            {where: {id: stageId}}
        );
        
        return payment;
    }

    async capturePayment(paymentId: string): Promise<void> {
        await this.paymentService.capturePayment(paymentId);
    }

    async cancelPayment(paymentId: string): Promise<void> {
        await this.paymentService.cancelPayment(paymentId);
    }

    async processPaymentNotification(notification) {
        console.log(notification)
        const stage = await this.stageRepository.findOne({where: {paymentId: notification.object.id}, include: {all: true}});
        if (!stage){
            throw new HttpException('"Этап не найден"', HttpStatus.NOT_FOUND);
        }
        await this.updateStage(stage.id, {...stage, paymentStatus: notification.object.status.toString()})
    }
}
