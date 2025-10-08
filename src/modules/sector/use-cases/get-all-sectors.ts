import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

export class GetAllSectorsUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(user: UserDomain, page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;

      if (!user) {
        throw new ForbiddenException("Forbidden");
      }

      if (!user.enterpriseId) {
        throw new UnauthorizedException("User not authorized");
      }

      const [sectors, total] = await this.prisma.$transaction([
        this.prisma.sector.findMany({
          where: { enterprise_id: user.enterpriseId },
          skip,
          take: pageSize,
          orderBy: { name: "asc" },
        }),
        this.prisma.sector.count({
          where: { enterprise_id: user.enterpriseId },
        }),
      ]);

      return {
        data: sectors,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error: any) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
