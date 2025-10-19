import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "src/modules/user/domain/user";

export interface CreateEnterpriseResponse {
  id: string;
  name: string;
  description: string;
  token: string;
}

@Injectable()
export class CreateEnterpriseUseCase {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async execute({
    user,
    name,
    description,
  }: {
    name: string;
    description: string;
    user: UserDomain;
  }): Promise<CreateEnterpriseResponse> {
    try {
      if (!user) {
        throw new ForbiddenException("Forbidden");
      }

      const enterpriseAllReadyExists = await this.prisma.enterprise.findFirst({
        where: { name },
      });

      if (enterpriseAllReadyExists) {
        throw new ConflictException("Enterprise all ready exists");
      }

      const enterpriseCreated = await this.prisma.enterprise.create({
        data: {
          name,
          description,
          users: { connect: { id: user.id } },
        },
      });

      const newUserRole = await this.prisma.user.update({
        where: { id: user.id },
        data: { enterprise_id: enterpriseCreated.id, type: "ADMIN" },
      });

      const payload = {
        sub: newUserRole.id,
        email: newUserRole.email,
        type: newUserRole.type,
        enterpriseId: newUserRole.enterprise_id,
        subSectorId: newUserRole.sub_sector_id,
      };
      const token = await this.jwtService.signAsync(payload);

      return {
        id: enterpriseCreated.id,
        name: enterpriseCreated.name,
        description: enterpriseCreated.description,
        token: token,
      };
    } catch (error: any) {
      console.log(error);
      if (
        error instanceof ForbiddenException ||
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
