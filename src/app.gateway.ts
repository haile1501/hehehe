import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ContestService } from './contest/contest.service';

@WebSocketGateway({
  namespace: 'api',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly contestService: ContestService) {}

  handleConnection(client: Socket) {
    const contestId = client.handshake.query.contestId as string;

    if (!contestId) {
      client.disconnect();
      return;
    }

    const roomName = `${contestId}`;

    client.join(roomName);

    console.log(`Client ${client.id} joined room ${roomName}`);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    return { event: 'pong', data };
  }

  @SubscribeMessage('next')
  async handleNextQuestion(
    @MessageBody() data: { contestId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.contestService.handleNext(data.contestId);
    this.server.emit('next-step');
  }

  @SubscribeMessage('submit')
  async handleSubmit(
    @MessageBody()
    data: {
      contestId: string;
      teamName: string;
      questionIndex: number;
      answer: string;
    },
  ) {
    await this.contestService.contestantSubmitRound1(data);
  }

  @SubscribeMessage('start-timer-admin')
  async handleStartTimer() {
    this.server.emit('start-timer');
  }
}
