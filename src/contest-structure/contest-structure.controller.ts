import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ContestStructureService } from './contest-structure.service';
import { ContestStructure } from './schemas/contest-structure.schema';

@Controller('contest-structure')
export class ContestStructureController {
  constructor(private readonly service: ContestStructureService) {}

  @Post()
  create(@Body() body: Partial<ContestStructure>) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() body: Partial<ContestStructure>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
