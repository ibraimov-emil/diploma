import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExperimentalResearch } from './models';
import { CreateExperimentalResearchDto, UpdateExperimentalResearchDto } from './dto';
import { Op } from 'sequelize';

@Injectable()
export class ExperimentalResearchService {
  constructor(
    @InjectModel(ExperimentalResearch)
    private experimentalResearchModel: typeof ExperimentalResearch,
  ) {}

  async create(createDto: CreateExperimentalResearchDto): Promise<ExperimentalResearch> {
    return this.experimentalResearchModel.create({ ...createDto });
  }

  async findAll(): Promise<ExperimentalResearch[]> {
    return this.experimentalResearchModel.findAll();
  }

  async findOne(id: number): Promise<ExperimentalResearch> {
    return this.experimentalResearchModel.findByPk(id);
  }

  async update(id: number, updateDto: UpdateExperimentalResearchDto): Promise<[number, ExperimentalResearch[]]> {
    return this.experimentalResearchModel.update({ ...updateDto }, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: number): Promise<number> {
    return this.experimentalResearchModel.destroy({ where: { id } });
  }

  async getActiveResearch(): Promise<ExperimentalResearch[]> {
    return this.experimentalResearchModel.findAll({
      where: {
        status: 'In Progress',
      },
    });
  }

  async getCompletedResearch(): Promise<ExperimentalResearch[]> {
    return this.experimentalResearchModel.findAll({
      where: {
        status: 'Completed',
      },
    });
  }

  async getResearchByDateRange(startDate: Date, endDate: Date): Promise<ExperimentalResearch[]> {
    return this.experimentalResearchModel.findAll({
      where: {
        startDate: {
          [Op.gte]: startDate,
        },
        endDate: {
          [Op.lte]: endDate,
        },
      },
    });
  }

  async updateResearchStatus(id: number, status: string): Promise<[number, ExperimentalResearch[]]> {
    return this.experimentalResearchModel.update(
      { status },
      {
        where: { id },
        returning: true,
      },
    );
  }
} 