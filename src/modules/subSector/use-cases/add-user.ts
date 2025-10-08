import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

export interface AddUserInSubSectorResponse {
  message: string;
}

@Injectable()
export class AddUserInSubSectorUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(
    user: UserDomain,
    subSectorId: string,
    memberId: string,
  ): Promise<AddUserInSubSectorResponse> {
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
