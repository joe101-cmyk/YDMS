import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
