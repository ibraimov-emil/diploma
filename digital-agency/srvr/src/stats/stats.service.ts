import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Project} from "../projects/projects.model";
import {RequestTable} from "../requests/requests.model";
import {Client} from "../clients/clients.model";
import {GetCounts} from "./stats";
import {Stage} from "../stages/stage.model";
import {Task} from "../tasks/tasks.model";

@Injectable()//провайдер для внедрения в controller
export class StatsService {

    constructor(
        @InjectModel(Project) private readonly projectsRepository: typeof Project,
        @InjectModel(RequestTable) private readonly requestRepository: typeof RequestTable,
        @InjectModel(Client) private readonly clientRepository: typeof Client,
        @InjectModel(Stage) private readonly stageRepository: typeof Stage,
        @InjectModel(Task) private readonly tasksRepository: typeof Task,
    ) {}

    async getCounts(): Promise<GetCounts> {
        const requestCount = await this.requestRepository.count();
        const clientsCount = await this.clientRepository.count();
        const projectsCount = await this.projectsRepository.count();
        const saleCount = await this.stageRepository.count({where: {paymentStatus: 'succeeded'}, include: {all: true}});
        const budget = await this.stageRepository.sum('cost', { where: { paymentStatus: 'succeeded' } });
        const tasksProcessed = await this.tasksRepository.count({where: {statusId: 3}, include: {all: true}})
        const tasksCompleted = await this.tasksRepository.count({where: {statusId: 4}, include: {all: true}})
        const tasksСons = await this.tasksRepository.count({where: {statusId: 1}, include: {all: true}})
        return {
            clients: clientsCount,
            request: requestCount,
            project: projectsCount,
            payment: saleCount,
            budget: budget,
            tasksProcessed: tasksProcessed,
            tasksCompleted: tasksCompleted,
            tasksСons: tasksСons,
        }
    }

}
