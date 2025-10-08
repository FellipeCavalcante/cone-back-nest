import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class GetAllEnterprisesUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;

      const [enterprises, total] = await this.prisma.$transaction([
        this.prisma.enterprise.findMany({
          select: { id: true, name: true, description: true },
          skip,
          take: pageSize,
          orderBy: { name: "asc" },
        }),
        this.prisma.enterprise.count(),
      ]);

      return {
        data: enterprises,
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
