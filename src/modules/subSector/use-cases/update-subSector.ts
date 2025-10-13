import { PrismaService } from "src/config/database/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class UpdateSubSectorUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(subSectorId: string, name: string): Promise<void> {
    try {
      const subSector = await this.prisma.sub_sector.update({
        where: { id: subSectorId },
        data: { name },
      });

      if (!subSector) {
        throw new NotFoundException("Sub sector not found");
      }
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
