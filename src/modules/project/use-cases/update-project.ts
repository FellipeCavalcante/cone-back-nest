import { PrismaService } from "src/config/database/prisma.service";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserDomain } from "src/modules/user/domain/user";
import { Prisma } from "@prisma/client";

@Injectable()
export class UpdateProjectUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({
    user,
    id,
    name,
    description,
    status,
  }: {
    user: UserDomain;
    id: string;
    name?: string;
    description?: string;
    status?: string;
  }): Promise<void> {
    try {
      if (user.type !== "ADMIN") {
        throw new UnauthorizedException("Only admins can update projects");
      }

      const data: Record<string, any> = {};
      if (name !== undefined) data.name = name;
      if (description !== undefined) data.description = description;
      if (status !== undefined) data.status = status;

      await this.prisma.project.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException("Project not found");
      }
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
