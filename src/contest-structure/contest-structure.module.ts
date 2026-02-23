import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContestStructure,
  ContestStructureSchema,
} from './schemas/contest-structure.schema';
import { ContestStructureService } from './contest-structure.service';
import { ContestStructureController } from './contest-structure.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ContestStructure.name,
        schema: ContestStructureSchema,
      },
    ]),
  ],
  controllers: [ContestStructureController],
  providers: [ContestStructureService],
  exports: [ContestStructureService],
})
export class ContestStructureModule {}
