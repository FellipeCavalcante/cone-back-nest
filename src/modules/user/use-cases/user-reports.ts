import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class UserReportsUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(page = 1, pageSize = 10) {
    try {
      const skip = (page - 1) * pageSize;

      const [users, total] = await this.prisma.$transaction([
        this.prisma.users.findMany({
          skip,
          take: pageSize,
          orderBy: { name: "asc" },
        }),
        this.prisma.users.count(),
      ]);

      return {
        data: users,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
