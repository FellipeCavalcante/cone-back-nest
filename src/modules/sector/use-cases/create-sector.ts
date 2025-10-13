import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

export interface CreateSectorResponse {
  id: string;
  name: string;
}

@Injectable()
export class CreateSectorUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({
    user,
    name,
  }: {
    user: UserDomain;
    name: string;
  }): Promise<CreateSectorResponse> {
    try {
      if (!user) {
        throw new ForbiddenException("Forbidden");
      }

      if (
        (user.type !== "ADMIN" && user.type !== "MANAGER") ||
        !user.enterpriseId
      ) {
        throw new UnauthorizedException("User not authorized");
      }

      const sectorAlreadyExists = await this.prisma.sector.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
          enterprise_id: user.enterpriseId,
        },
      });

      if (sectorAlreadyExists) {
        throw new ConflictException("Sector already exists");
      }

      const sector = await this.prisma.sector.create({
        data: {
          name,
          enterprise_id: user.enterpriseId,
        },
      });

      return {
        id: sector.id,
        name: sector.name,
      };
    } catch (error: any) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException ||
        error instanceof ConflictException
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
