import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "../user/domain/user";

@Injectable()
export class EnterpriseService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create({
    user,
    name,
    description,
  }: {
    name: string;
    description: string;
    user: UserDomain;
  }): Promise<{
    access_token: string;
    enterprise: { id: string; name: string; description: string };
  }> {
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

      const newUserRole = await this.prisma.users.update({
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
        access_token: token,
        enterprise: {
          id: enterpriseCreated.id,
          name: enterpriseCreated.name,
          description: enterpriseCreated.description,
        },
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

  async getAll(page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;

      const [enterprises, total] = await this.prisma.$transaction([
        this.prisma.enterprise.findMany({
          select: { id: true, name: true, description: true },
          skip,
          take: pageSize,
          orderBy: { name: "asc" },
        }),
        this.prisma.enterprise.count(),
      ]);

      return {
        data: enterprises,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getEnterpriseMembers(enterpriseId: string, page = 1, pageSize = 20) {
    try {
      const skip = (page - 1) * pageSize;

      const [members, total] = await this.prisma.$transaction([
        this.prisma.users.findMany({
          where: { enterprise_id: enterpriseId },
          select: { id: true, name: true, email: true, type: true },
          skip,
          take: pageSize,
          orderBy: { name: "asc" },
        }),
        this.prisma.users.count({ where: { enterprise_id: enterpriseId } }),
      ]);

      return {
        data: members,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
