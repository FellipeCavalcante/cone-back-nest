import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/config/database/prisma.service";
import { AuthUser } from "./domain/user";

export interface RefreshTokenResponse {
  token: string;
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async refreshToken(user: AuthUser): Promise<RefreshTokenResponse> {
    const userInDb = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!userInDb) {
      throw new InternalServerErrorException("User not found");
    }

    const payload = {
      sub: userInDb.id,
      email: userInDb.email,
      type: userInDb.type,
    };
    const token = await this.jwtService.signAsync(payload);

    return { token: token };
  }

  async reports(page = 1, pageSize = 10) {
    try {
      const skip = (page - 1) * pageSize;

      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          skip,
          take: pageSize,
          orderBy: { name: "asc" },
        }),
        this.prisma.user.count(),
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
