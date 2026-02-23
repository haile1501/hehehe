import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContestStructureDoc = ContestStructure & Document;

@Schema({ _id: false })
export class Choice {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  text: string;
}

@Schema({ _id: false })
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ type: Array, default: [] })
  choices: Choice[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true })
  time: number;
}

@Schema({ _id: false })
export class Round {
  @Prop({ type: Array, default: [] })
  questions: Question[];
}

@Schema({
  collection: 'contest-structure',
  timestamps: {
    createdAt: 'createdDate',
    updatedAt: 'updatedDate',
  },
  toJSON: {
    transform(_, ret) {
      delete ret.__v;
    },
  },
})
export class ContestStructure {
  @Prop()
  id: string;

  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: Object })
  round1: Round;

  @Prop({ type: Object })
  round2: Round;

  @Prop({ type: Object })
  round3: Round;
}

export const ContestStructureSchema =
  SchemaFactory.createForClass(ContestStructure);
