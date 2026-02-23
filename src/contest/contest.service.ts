import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Contest,
  ContestDoc,
  QuestionProgress,
  Team,
} from './schemas/contest.schema';
import { Model } from 'mongoose';
import { ContestStructureService } from 'src/contest-structure/contest-structure.service';

@Injectable()
export class ContestService {
  constructor(
    private readonly contestStructureService: ContestStructureService,
    @InjectModel(Contest.name)
    private readonly contestModel: Model<ContestDoc>,
  ) {}

  public async adminGetAllContest() {
    return await this.contestModel.find();
  }

  public async adminCreateContest(
    contestStructureId: string,
    contestName: string,
  ) {
    const contestStructure =
      await this.contestStructureService.findById(contestStructureId);

    const contest = new Contest();
    contest.name = contestName;
    contest.round1 = { questions: [], currentQuestion: -1 };
    contest.round2 = { questions: [], currentQuestion: -1 };
    contest.round3 = { questions: [], currentQuestion: -1 };

    contest.round1.questions = contestStructure.round1.questions.map((item) => {
      const question = new QuestionProgress();
      question.question = item.question;
      question.choices = item.choices;
      question.correctAnswer = item.correctAnswer;
      question.time = item.time;
      question.teamAnswers = [];

      return question;
    });

    contest.round2.questions = contestStructure.round2.questions.map((item) => {
      const question = new QuestionProgress();
      question.question = item.question;
      question.choices = item.choices;
      question.correctAnswer = item.correctAnswer;
      question.time = item.time;
      question.teamAnswers = [];

      return question;
    });

    contest.round3.questions = contestStructure.round3.questions.map((item) => {
      const question = new QuestionProgress();
      question.question = item.question;
      question.choices = item.choices;
      question.correctAnswer = item.correctAnswer;
      question.time = item.time;
      question.teamAnswers = [];

      return question;
    });

    return await this.contestModel.create(contest);
  }

  public async adminGetContestById(id: string) {
    return await this.contestModel.findById(id);
  }

  public async adminUpdateContestTeams(contestId: string, teams: Team[]) {
    return await this.contestModel.findByIdAndUpdate(contestId, { teams });
  }

  public async adminStartContest(contestId: string) {
    return await this.contestModel.findByIdAndUpdate(contestId, {
      isStarted: true,
    });
  }

  public async login(payload: {
    contestId: string;
    teamName: string;
    password: string;
  }) {
    const { teamName, password, contestId } = payload;

    // viewer special case
    if (teamName === 'viewer') {
      return {
        username: 'viewer',
        role: 'viewer',
      };
    }

    const contest = await this.contestModel.findById(contestId);
    if (!contest) {
      return null;
    }

    const teams = contest.teams || [];

    const matchedTeam = teams.find(
      (team: any) => team.name === teamName && team.password === password,
    );

    if (!matchedTeam) {
      return null;
    }

    return {
      username: matchedTeam.name,
      role: 'contestant',
    };
  }

  public async handleNext(contestId: string) {
    const contest = await this.contestModel.findById(contestId);
    if (!contest.isStarted) {
      contest.isStarted = true;
    }

    const currentRound = contest.currentRound;
    if (currentRound === 1) {
      const round1 = contest.round1;

      if (contest.currentState === 'score-board') {
        round1.currentQuestion = round1.currentQuestion + 1;

        if (round1.currentQuestion < round1.questions.length) {
          round1.questions[round1.currentQuestion].startedDate = Date.now();
        } else {
          contest.currentRound = contest.currentRound + 1;
        }

        contest.currentState = 'question';
      } else {
        const teams = contest.teams;
        const question = round1.questions[round1.currentQuestion];
        const currentQuestionAnswers = question.teamAnswers;

        const correctAnswers = currentQuestionAnswers.filter(
          (ans) => ans.isCorrect,
        );

        correctAnswers.forEach((answer, index) => {
          let score = 0;

          if (index === 0) score = 20;
          else if (index === 1) score = 15;
          else if (index === 2) score = 10;
          else score = 5;

          const team = teams.find((t) => t.name === answer.teamName);
          if (team) {
            team.totalScore += score;
          }
        });

        contest.currentState = 'score-board';
      }
    }

    if (currentRound === 2) {
      if (contest.currentState === 'score-board') {
        contest.currentState = 'question';
        contest.currentRound = contest.currentRound + 1;
        contest.round3.currentQuestion = contest.round3.currentQuestion + 1;
      } else {
        contest.currentState = 'score-board';
      }
    }

    if (currentRound === 3) {
      const round3 = contest.round3;

      if (contest.currentState === 'score-board') {
        round3.currentQuestion = round3.currentQuestion + 1;
        contest.currentState = 'question';
      } else if (contest.currentState === 'show-answer') {
        contest.currentState = 'score-board';
      } else {
        contest.currentState = 'show-answer';
      }
    }

    await this.contestModel.findByIdAndUpdate(contestId, contest);
  }

  public async contestantSubmitRound1(body: {
    contestId: string;
    teamName: string;
    questionIndex: number;
    answer: string;
  }) {
    try {
      const { contestId, teamName, questionIndex, answer } = body;

      const contest = await this.contestModel.findById(contestId);

      if (!contest) {
        throw new Error('Contest not found');
      }

      if (!contest.round1) {
        throw new Error('Round 1 not initialized');
      }

      if (contest.currentRound !== 1) {
        throw new Error('Not in round 1');
      }

      const round1 = contest.round1;

      if (questionIndex < 0 || questionIndex >= round1.questions.length) {
        throw new Error('Invalid question index');
      }

      const question = round1.questions[questionIndex];

      // ❗ Không cho submit 2 lần
      const existed = question.teamAnswers?.find(
        (t) => t.teamName === teamName,
      );

      if (existed) {
        throw new Error('Team already answered this question');
      }

      // So đáp án
      const isCorrect = question.correctAnswer === answer;

      // Push answer
      await this.contestModel.updateOne(
        {
          _id: contestId,
          [`round1.questions.${questionIndex}.teamAnswers.teamName`]: {
            $ne: teamName,
          },
        },
        {
          $push: {
            [`round1.questions.${questionIndex}.teamAnswers`]: {
              teamName,
              answerLabel: answer,
              isCorrect,
            },
          },
        },
      );

      return {
        success: true,
        isCorrect,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
