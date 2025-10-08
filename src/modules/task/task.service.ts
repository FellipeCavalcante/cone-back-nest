import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "../user/domain/user";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create({
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
  }) {
    try {
      const task = await this.prisma.tasks.create({
        data: {
          title,
          description,
          enterprise_id: user.enterpriseId || "",
          status: "PENDING",
          task_members: {
            connect: memberIds?.map((memberId) => ({ id: memberId })) || [],
          },
          task_sub_sector: {
            connect:
              subSectorIds?.map((subSectorId) => ({ id: subSectorId })) || [],
          },
        },
      });

      return { task };
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
