export const SocketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  PING: 'ping',
  PONG: 'pong',
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
  ONLINE: 'online',
  OFFLINE: 'offline',
  ERROR: 'socket:error',
} as const;

export type SocketEvent = (typeof SocketEvents)[keyof typeof SocketEvents];
