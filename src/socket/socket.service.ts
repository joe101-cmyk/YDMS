import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { UsersService } from '../users/users.service';
import { SocketEvents, SocketEvent } from './socket.events';
import { AuthenticatedSocket } from './interfaces/authenticated-socket.interface';
import { OnlineUser } from './interfaces/online-user.interface';
import { SocketUser } from './interfaces/socket-user.interface';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private readonly onlineUsers = new Map<string, OnlineUser>();
  private readonly sockets = new Map<string, AuthenticatedSocket>();
  private readonly socketUsers = new Map<string, SocketUser>();
  private readonly userSockets = new Map<string, Set<string>>();
  private server?: Server | Namespace;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  setServer(server: Server | Namespace) {
    this.server = server;
  }

  async authenticate(socket: AuthenticatedSocket): Promise<SocketUser> {
    const token = this.extractToken(socket);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      const user = await this.usersService.findById(payload.sub);
      const authenticatedUser = { id: user.id, email: user.email, role: user.role };
      socket.data.user = authenticatedUser;
      return authenticatedUser;
    } catch {
      throw new UnauthorizedException('Invalid or expired bearer token');
    }
  }

  async registerConnection(socket: AuthenticatedSocket, user: SocketUser): Promise<OnlineUser> {
    const now = new Date();
    const existingSockets = this.userSockets.get(user.id);
    const isNewUser = !existingSockets || existingSockets.size === 0;
    const socketIds = existingSockets || new Set<string>();

    socketIds.add(socket.id);
    this.userSockets.set(user.id, socketIds);
    this.sockets.set(socket.id, socket);
    this.socketUsers.set(socket.id, user);

    const onlineUser: OnlineUser = {
      userId: user.id,
      socketId: socket.id,
      connectedAt: this.onlineUsers.get(user.id)?.connectedAt || now,
      lastActivity: now,
    };
    this.onlineUsers.set(user.id, onlineUser);
    await this.joinUserRoom(socket, user.id);

    if (isNewUser) {
      this.emitToAll(SocketEvents.ONLINE, onlineUser);
    }

    return onlineUser;
  }

  unregisterConnection(socket: AuthenticatedSocket): OnlineUser | undefined {
    const user = this.socketUsers.get(socket.id);
    this.sockets.delete(socket.id);
    this.socketUsers.delete(socket.id);

    if (!user) {
      return undefined;
    }

    const socketIds = this.userSockets.get(user.id);
    socketIds?.delete(socket.id);
    if (socketIds && socketIds.size > 0) {
      const onlineUser = this.onlineUsers.get(user.id);
      if (onlineUser) {
        onlineUser.socketId = socketIds.values().next().value as string;
        onlineUser.lastActivity = new Date();
      }
      return undefined;
    }

    this.userSockets.delete(user.id);
    const offlineUser = this.onlineUsers.get(user.id);
    this.onlineUsers.delete(user.id);
    if (offlineUser) {
      this.emitToAll(SocketEvents.OFFLINE, offlineUser);
    }
    return offlineUser;
  }

  getOnlineUsers(): OnlineUser[] {
    return [...this.onlineUsers.values()];
  }

  getOnlineUserCount(): number {
    return this.onlineUsers.size;
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  getSocketByUserId(userId: string): AuthenticatedSocket | undefined {
    const socketId = this.userSockets.get(userId)?.values().next().value as string | undefined;
    return socketId ? this.sockets.get(socketId) : undefined;
  }

  getUserBySocketId(socketId: string): SocketUser | undefined {
    return this.socketUsers.get(socketId);
  }

  async joinRoom(socket: AuthenticatedSocket, room: string) {
    const roomName = this.requireRoom(room);
    await socket.join(roomName);
    this.updateActivity(socket.id);
    return { room: roomName, joined: true };
  }

  async leaveRoom(socket: AuthenticatedSocket, room: string) {
    const roomName = this.requireRoom(room);
    await socket.leave(roomName);
    this.updateActivity(socket.id);
    return { room: roomName, left: true };
  }

  joinUserRoom(socket: AuthenticatedSocket, userId: string) {
    return this.joinRoom(socket, `user:${userId}`);
  }

  joinConversationRoom(socket: AuthenticatedSocket, conversationId: string) {
    return this.joinRoom(socket, `conversation:${conversationId}`);
  }

  broadcastToRoom(room: string, event: SocketEvent, payload: unknown, exceptSocketId?: string) {
    const roomName = this.requireRoom(room);
    const target = this.getServer().to(roomName);
    if (exceptSocketId) {
      target.except(exceptSocketId).emit(event, payload);
      return;
    }
    target.emit(event, payload);
  }

  emitToUser(userId: string, event: SocketEvent, payload: unknown) {
    const socketIds = this.userSockets.get(userId);
    socketIds?.forEach((socketId) => this.emitToSocket(socketId, event, payload));
  }

  emitToRoom(room: string, event: SocketEvent, payload: unknown) {
    this.broadcastToRoom(room, event, payload);
  }

  emitToAll(event: SocketEvent, payload: unknown) {
    this.getServer().emit(event, payload);
  }

  emitExceptSender(senderSocketId: string, event: SocketEvent, payload: unknown) {
    this.getServer().except(senderSocketId).emit(event, payload);
  }

  emitToSocket(socketId: string, event: SocketEvent, payload: unknown) {
    const socket = this.sockets.get(socketId);
    if (!socket) {
      throw new WsException('Socket is no longer connected');
    }
    socket.emit(event, payload);
  }

  emitSocketError(socket: AuthenticatedSocket, message: string) {
    socket.emit(SocketEvents.ERROR, { message });
  }

  handlePing(socket: AuthenticatedSocket) {
    this.updateActivity(socket.id);
    this.emitToSocket(socket.id, SocketEvents.PONG, { timestamp: new Date().toISOString() });
  }

  handleTyping(socket: AuthenticatedSocket, room: string, conversationId?: string, isTyping = true) {
    const user = this.getUserBySocketId(socket.id);
    const event = isTyping ? SocketEvents.TYPING : SocketEvents.STOP_TYPING;
    this.broadcastToRoom(room, event, { userId: user?.id, conversationId }, socket.id);
    this.updateActivity(socket.id);
  }

  private extractToken(socket: AuthenticatedSocket): string | undefined {
    const authorization = socket.handshake.headers.authorization || socket.handshake.auth?.token;
    if (typeof authorization !== 'string') {
      return undefined;
    }

    return authorization.startsWith('Bearer ') ? authorization.slice(7) : undefined;
  }

  private updateActivity(socketId: string) {
    const user = this.socketUsers.get(socketId);
    if (!user) {
      throw new WsException('Socket is not authenticated');
    }

    const onlineUser = this.onlineUsers.get(user.id);
    if (onlineUser) {
      onlineUser.lastActivity = new Date();
    }
  }

  private requireRoom(room: string): string {
    const roomName = room?.trim();
    if (!roomName) {
      throw new WsException('Room is required');
    }
    return roomName;
  }

  private getServer(): Server | Namespace {
    if (!this.server) {
      this.logger.error('Socket server has not been initialized');
      throw new WsException('Socket server is unavailable');
    }
    return this.server;
  }
}
