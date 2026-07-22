export interface OnlineUser {
  userId: string;
  socketId: string;
  connectedAt: Date;
  lastActivity: Date;
}
