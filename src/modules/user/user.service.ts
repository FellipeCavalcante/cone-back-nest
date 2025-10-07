import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "./domain/user";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async refreshUsers(user: UserDomain): Promise<{ access_token: string }> {
    const userInDb = await this.prisma.users.findUnique({
      where: { id: user.id },
    });

    if (!userInDb) {
      throw new InternalServerErrorException("User not found");
    }

    const payload = {
      sub: userInDb.id,
      email: userInDb.email,
      type: userInDb.type,
      enterpriseId: userInDb.enterprise_id,
      subSectorId: userInDb.sub_sector_id,
    };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async reports(page = 1, pageSize = 10) {
    try {
      const skip = (page - 1) * pageSize;

      const [users, total] = await this.prisma.$transaction([
        this.prisma.users.findMany({
          skip,
          take: pageSize,
          orderBy: { name: "asc" },
        }),
        this.prisma.users.count(),
      ]);

      return {
        data: users,
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
