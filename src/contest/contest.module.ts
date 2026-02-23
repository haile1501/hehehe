import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contest, ContestSchema } from './schemas/contest.schema';
import { ContestStructureModule } from 'src/contest-structure/contest-structure.module';
import { ContestService } from './contest.service';
import { ContestController } from './contest.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Contest.name,
        schema: ContestSchema,
      },
    ]),
    ContestStructureModule,
  ],
  providers: [ContestService],
  controllers: [ContestController],
  exports: [ContestService],
})
export class ContestModule {}
