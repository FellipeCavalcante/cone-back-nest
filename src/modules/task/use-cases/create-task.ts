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
      const task = await this.prisma.tasks.create({
        data: {
          title,
          description,
          enterprise_id: user.enterpriseId || "",
          status: "PENDING",
          task_members: {
            create:
              memberIds?.map((memberId) => ({
                user_id: memberId,
              })) || [],
          },
          task_sub_sector: {
            create:
              subSectorIds?.map((subSectorId) => ({
                sub_sector_id: subSectorId,
              })) || [],
          },
        },
        include: {
          task_members: { select: { user_id: true } },
          task_sub_sector: { select: { sub_sector_id: true } },
        },
      });

      return {
        id: task.id,
        creatorId: user.id,
        title: task.title,
        description: task.description,
        memberIds: task.task_members.map((m) => m.user_id),
        subSectorIds: task.task_sub_sector.map((s) => s.sub_sector_id),
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
