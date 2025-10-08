import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "../user/domain/user";

@Injectable()
export class SubSectorService {
  constructor(private prisma: PrismaService) {}

  async create({
    user,
    name,
    sector,
  }: {
    user: UserDomain;
    name: string;
    sector: string;
  }): Promise<{ id: string; name: string; sectorId: string }> {
    try {
      if (!user) throw new ForbiddenException("Forbidden");

      const sectorExists = await this.prisma.sector.findFirst({
        where: { id: sector },
        select: { enterprise_id: true },
      });

      if (!sectorExists) throw new NotFoundException("Sector not found");

      if (sectorExists.enterprise_id !== user.enterpriseId)
        throw new ForbiddenException("Sector id and user do not match");

      const subSector = await this.prisma.sub_sector.create({
        data: {
          name,
          sector_id: sector,
        },
      });

      return {
        id: subSector.id,
        name: subSector.name,
        sectorId: subSector.sector_id,
      };
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async addMemberToSubSector(
    user: UserDomain,
    subSectorId: string,
    memberId: string,
  ): Promise<{ message: string }> {
    try {
      if (!user) throw new ForbiddenException("Forbidden");

      if (user.type !== "ADMIN" && user.type !== "MANAGER") {
        throw new UnauthorizedException("User not authorized");
      }

      await this.prisma.users.update({
        where: { id: memberId },
        data: { sub_sector_id: subSectorId },
      });

      return { message: "Member added to sub sector successfully" };
    } catch (error: any) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
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
