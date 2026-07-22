import { IsOptional, IsString } from 'class-validator';
import { RoomDto } from './room.dto';

export class TypingDto extends RoomDto {
  @IsOptional()
  @IsString()
  conversationId?: string;
}
