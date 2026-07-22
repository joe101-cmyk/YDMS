import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { appConfig } from '../common/config/app.config';
import { RoomDto } from './dto/room.dto';
import { TypingDto } from './dto/typing.dto';
import { SocketEvents } from './socket.events';
import type { AuthenticatedSocket } from './interfaces/authenticated-socket.interface';
import { SocketService } from './socket.service';

@WebSocketGateway(appConfig.socketPort, {
  namespace: appConfig.socketNamespace,
  cors: {
    origin: appConfig.socketCorsOrigin,
    credentials: appConfig.socketCorsCredentials,
  },
  transports: appConfig.socketTransports as any,
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: Server | Namespace;

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server | Namespace) {
    this.socketService.setServer(server);
    this.logger.log(`Socket server started at ${new Date().toISOString()}`);
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const user = await this.socketService.authenticate(client);
      const onlineUser = await this.socketService.registerConnection(client, user);
      this.logger.log(
        `User connected: userId=${onlineUser.userId} socketId=${onlineUser.socketId} at=${onlineUser.connectedAt.toISOString()}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Socket authentication failed';
      this.logger.warn(`Socket rejected: socketId=${client.id} reason=${message}`);
      this.socketService.emitSocketError(client, message);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const user = this.socketService.getUserBySocketId(client.id);
    const offlineUser = this.socketService.unregisterConnection(client);
    this.logger.log(
      `User disconnected: userId=${user?.id || 'unknown'} socketId=${client.id} at=${new Date().toISOString()}`,
    );

    if (offlineUser) {
      this.logger.debug(`User is offline: userId=${offlineUser.userId}`);
    }
  }

  @SubscribeMessage(SocketEvents.JOIN_ROOM)
  joinRoom(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() dto: RoomDto) {
    return this.socketService.joinRoom(client, dto.room);
  }

  @SubscribeMessage(SocketEvents.LEAVE_ROOM)
  leaveRoom(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() dto: RoomDto) {
    return this.socketService.leaveRoom(client, dto.room);
  }

  @SubscribeMessage(SocketEvents.PING)
  ping(@ConnectedSocket() client: AuthenticatedSocket) {
    this.socketService.handlePing(client);
  }

  @SubscribeMessage(SocketEvents.TYPING)
  typing(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() dto: TypingDto) {
    this.socketService.handleTyping(client, dto.room, dto.conversationId);
  }

  @SubscribeMessage(SocketEvents.STOP_TYPING)
  stopTyping(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() dto: TypingDto) {
    this.socketService.handleTyping(client, dto.room, dto.conversationId, false);
  }

  @SubscribeMessage(SocketEvents.ONLINE)
  online() {
    return this.socketService.getOnlineUsers();
  }
}
