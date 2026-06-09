import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRoomDto, JoinRoomDto } from './dto/rooms.dto';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Req() req: any, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(req.user.id, dto);
  }

  @Post('join')
  async joinRoom(@Req() req: any, @Body() dto: JoinRoomDto) {
    return this.roomsService.join(req.user.id, dto);
  }

  @Get()
  async getMyRooms(@Req() req: any) {
    return this.roomsService.getMyRooms(req.user.id);
  }
}
