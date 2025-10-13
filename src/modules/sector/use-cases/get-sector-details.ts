import { PrismaService } from "src/config/database/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

export interface GetSectorDetailsResponse {
  id: string;
  name: string;
  sub_sectors: SubSector[];
}

interface SubSector {
  id: string;
  name: string;
}

@Injectable()
export class GetSectorDetailsUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(sectorId: string): Promise<GetSectorDetailsResponse> {
    try {
      const sector = await this.prisma.sector.findUnique({
        where: { id: sectorId },
        include: {
          sub_sector: {
            include: {
              project_sub_sector: true,
            },
          },
        },
      });

      if (!sector) {
        throw new NotFoundException("Sector not found");
      }

      return {
        id: sector.id,
        name: sector.name,
        sub_sectors: sector.sub_sector,
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
