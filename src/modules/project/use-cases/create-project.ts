import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

@Injectable()
export class CreateProjectUseCase {
  constructor(readonly prisma: PrismaService) {}

  async execute({
    user,
    name,
    description,
    status,
    subSectors,
    members,
  }: {
    user: UserDomain;
    name: string;
    description: string;
    status?: string;
    subSectors?: string[];
    members?: string[];
  }): Promise<{
    id: string;
    name: string;
    description: string;
    status: string;
  }> {
    try {
      if (user.type !== "ADMIN") {
        throw new UnauthorizedException("Only admins can create projects");
      }

      if (!user.enterpriseId) {
        throw new UnauthorizedException("User is not linked to an enterprise");
      }

      const project = await this.prisma.project.create({
        data: {
          name,
          description,
          status: status || "STARTED",
          enterprise_id: user.enterpriseId ?? null,
          project_member: {
            create:
              members?.map((memberId) => ({
                user_id: memberId,
              })) || [],
          },
          project_sub_sector: {
            create:
              subSectors?.map((subSectorId) => ({
                sub_sector_id: subSectorId,
              })) || [],
          },
        },
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
