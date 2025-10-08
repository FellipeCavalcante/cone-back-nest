import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class GetAllEnterprisesMembers {
  constructor(private prisma: PrismaService) {}

  async execute(enterpriseId: string, page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;

      const [members, total] = await this.prisma.$transaction([
        this.prisma.users.findMany({
          where: { enterprise_id: enterpriseId },
          select: { id: true, name: true, email: true, type: true },
          skip,
          take: pageSize,
          orderBy: { name: "asc" },
        }),
        this.prisma.users.count({ where: { enterprise_id: enterpriseId } }),
      ]);

      return {
        data: members,
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
