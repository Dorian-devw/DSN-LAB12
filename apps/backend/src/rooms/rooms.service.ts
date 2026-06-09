import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, JoinRoomDto } from './dto/rooms.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateRoomDto) {
    const userOwnedRoomsCount = await this.prisma.room.count({
      where: { ownerId: userId },
    });

    if (userOwnedRoomsCount >= 3) {
      throw new BadRequestException('Maximum of 3 rooms can be created per user');
    }

    const inviteCode = randomBytes(4).toString('hex').toUpperCase();

    const room = await this.prisma.room.create({
      data: {
        ownerId: userId,
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        isAcademic: dto.isAcademic || false,
        inviteCode,
      },
    });

    // Auto-join the creator
    await this.prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId: userId,
      },
    });

    return room;
  }

  async join(userId: string, dto: JoinRoomDto) {
    const room = await this.prisma.room.findUnique({
      where: { inviteCode: dto.inviteCode },
      include: { members: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found with provided invite code');
    }

    if (room.members.length >= room.maxMembers) {
      throw new BadRequestException('Room has reached its maximum member capacity');
    }

    const alreadyMember = room.members.find(m => m.userId === userId);
    if (alreadyMember) {
      throw new BadRequestException('User is already a member of this room');
    }

    await this.prisma.roomMember.create({
      data: {
        roomId: room.id,
        userId: userId,
      },
    });

    return { message: 'Joined room successfully', room };
  }

  async getMyRooms(userId: string) {
    return this.prisma.room.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        owner: { select: { fullName: true, profileImageUrl: true } },
        _count: { select: { members: true } }
      }
    });
  }
}
