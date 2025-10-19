import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

export interface AddUserInProjectResponse {
  message: string;
}

@Injectable()
export class AddUserUseCaseInProject {
  constructor(private prisma: PrismaService) {}

  async execute(
    user: UserDomain,
    projectId: string,
    memberId: string,
  ): Promise<AddUserInProjectResponse> {
    try {
      if (user.type !== "ADMIN" && user.type !== "MANAGER") {
        throw new UnauthorizedException("User not authorized");
      }

      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException("Project not found");
      }

      await this.prisma.projectMember.create({
        data: {
          project_id: projectId,
          user_id: memberId,
        },
      });

      return { message: "User added to project successfully" };
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
