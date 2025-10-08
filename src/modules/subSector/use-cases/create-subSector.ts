import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

export interface CreateSubSectorResponse {
  id: string;
  name: string;
  sectorId: string;
}

@Injectable()
export class CreateSubSectorUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({
    user,
    name,
    sector,
  }: {
    user: UserDomain;
    name: string;
    sector: string;
  }): Promise<CreateSubSectorResponse> {
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
}
