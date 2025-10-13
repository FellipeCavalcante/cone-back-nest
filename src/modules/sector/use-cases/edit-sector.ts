import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

@Injectable()
export class EditSectorUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({
    user,
    sectorId,
    name,
  }: {
    user: UserDomain;
    sectorId: string;
    name: string;
  }): Promise<void> {
    try {
      if (user.type !== "ADMIN" && user.type !== "MANAGER") {
        throw new UnauthorizedException("User not authorized");
      }

      const sector = await this.prisma.sector.update({
        where: { id: sectorId },
        data: { name },
      });

      if (!sector) {
        throw new NotFoundException("Sector not found");
      }
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
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
