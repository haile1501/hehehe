import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ContestService } from './contest.service';
import { Team } from './schemas/contest.schema';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @Get('admin')
  public async adminGetAllContest() {
    return await this.contestService.adminGetAllContest();
  }

  @Post('admin')
  public async adminCreateContest(
    @Body() body: { contestStructureId: string; name: string },
  ) {
    return await this.contestService.adminCreateContest(
      body.contestStructureId,
      body.name,
    );
  }

  @Get('/admin/:id')
  public async adminGetContestById(@Param('id') id: string) {
    return await this.contestService.adminGetContestById(id);
  }

  @Post('admin/:id/teams')
  public async adminUpdateContestTeams(
    @Param('id') id: string,
    @Body() body: { teams: Team[] },
  ) {
    return await this.contestService.adminUpdateContestTeams(id, body.teams);
  }

  @Post('admin/:id/start-contest')
  public async adminStartContest(@Param('id') id: string) {
    return await this.contestService.adminStartContest(id);
  }

  @Post('contestant/login')
  public async contestantLogin(
    @Body()
    body: {
      contestId: string;
      teamName: string;
      password: string;
    },
  ) {
    return await this.contestService.login(body);
  }

  @Post('contestant/submit')
  public async contestantSubmiRound1(
    @Body()
    body: {
      contestId: string;
      teamName: string;
      questionIndex: number;
      answer: string;
    },
  ) {
    return await this.contestService.contestantSubmitRound1(body);
  }
}
