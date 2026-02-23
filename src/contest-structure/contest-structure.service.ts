import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ContestStructure,
  ContestStructureDoc,
} from './schemas/contest-structure.schema';

@Injectable()
export class ContestStructureService {
  constructor(
    @InjectModel(ContestStructure.name)
    private readonly contestModel: Model<ContestStructureDoc>,
  ) {}

  async create(data: Partial<ContestStructure>) {
    return this.contestModel.create(data);
  }

  async findAll() {
    return this.contestModel.find();
  }

  async findById(id: string) {
    const result = await this.contestModel.findById(id);
    if (!result) {
      throw new NotFoundException('ContestStructure not found');
    }
    return result;
  }

  async update(id: string, data: Partial<ContestStructure>) {
    return this.contestModel.findByIdAndUpdate(id, data);
  }

  async delete(id: string) {
    return this.contestModel.findByIdAndDelete(id);
  }
}
