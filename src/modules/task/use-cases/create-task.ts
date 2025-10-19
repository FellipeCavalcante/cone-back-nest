import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

export interface TaskResponse {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  memberIds: string[];
  subSectorIds: string[];
}

@Injectable()
export class CreateTaskUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({
    user,
    title,
    description,
    memberIds,
    subSectorIds,
  }: {
    user: UserDomain;
    title: string;
    description: string;
    memberIds?: string[];
    subSectorIds?: string[];
  }): Promise<TaskResponse> {
    try {
      const task = await this.prisma.task.create({
        data: {
          title,
          description,
          enterprise_id: user.enterpriseId || "",
          status: "PENDING",
          members: {
            create:
              memberIds?.map((memberId) => ({
                user_id: memberId,
              })) || [],
          },
          sub_sector_links: {
            create:
              subSectorIds?.map((subSectorId) => ({
                sub_sector_id: subSectorId,
              })) || [],
          },
        },
        include: {
          members: { select: { user_id: true } },
          sub_sector_links: { select: { sub_sector_id: true } },
        },
      });

      return {
        id: task.id,
        creatorId: user.id,
        title: task.title,
        description: task.description,
        memberIds: task.members.map((m) => m.user_id),
        subSectorIds: task.sub_sector_links.map((s) => s.sub_sector_id),
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
