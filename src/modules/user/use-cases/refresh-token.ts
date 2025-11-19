import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/config/database/prisma.service";
import { UserDomain } from "../domain/user";

export interface RefreshTokenResponse {
  token: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async execute(user: UserDomain): Promise<RefreshTokenResponse> {
    const userInDb = await this.prisma.user.findUnique({
      where: { id: user.id },
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
}
