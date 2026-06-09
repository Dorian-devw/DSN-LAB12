import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Used to notify all connected clients about live match updates
  sendMatchUpdate(matchId: string, payload: any) {
    this.server.emit(`match_update_${matchId}`, payload);
  }

  // Notifies a specific user about gamification events (e.g. badge unlocked)
  sendUserNotification(userId: string, payload: any) {
    this.server.emit(`user_notification_${userId}`, payload);
  }

  @SubscribeMessage('join_match_room')
  handleJoinMatchRoom(@MessageBody() matchId: string, @ConnectedSocket() client: Socket) {
    client.join(`match_${matchId}`);
    return { event: 'joined', matchId };
  }
}
