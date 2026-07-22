import { Socket } from 'socket.io';
import { SocketUser } from './socket-user.interface';

export interface AuthenticatedSocket extends Socket {
  data: {
    user?: SocketUser;
  };
}
