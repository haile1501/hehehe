import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Choice } from 'src/contest-structure/schemas/contest-structure.schema';

export type ContestDoc = Contest & Document;

@Schema({ id: false })
export class TeamAnswer {
  @Prop({ type: String })
  teamName: string;

  @Prop({ type: String })
  answerLabel: string;

  @Prop({ type: Boolean })
  isCorrect: boolean;
}

@Schema({ id: false })
export class QuestionProgress {
  @Prop({ required: true })
  question: string;

  @Prop({ type: Array, default: [] })
  choices: Choice[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop({ required: true })
  time: number;

  @Prop({ type: Number })
  startedDate: number;

  @Prop({ type: Array, default: [] })
  teamAnswers: TeamAnswer[];
}

@Schema({ id: false })
export class RoundProgress {
  @Prop({ type: Array, default: [] })
  questions: QuestionProgress[];

  @Prop({ type: Number, default: 0 })
  currentQuestion: number;
}

@Schema({ id: false })
export class Team {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: Number, default: 0 })
  totalScore: number;
}

@Schema({
  collection: 'contest',
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
export class Contest {
  @Prop()
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Number, default: 1 })
  currentRound: number;

  @Prop({ type: String, default: 'score-board' })
  currentState: string;

  @Prop({ type: Object })
  round1: RoundProgress;

  @Prop({ type: Object })
  round2: RoundProgress;

  @Prop({ type: Object })
  round3: RoundProgress;

  @Prop({ type: Boolean, default: false })
  isStarted: boolean;

  @Prop({ type: Array, default: [] })
  teams: Team[];
}

export const ContestSchema = SchemaFactory.createForClass(Contest);
