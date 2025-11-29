import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthUser } from "./domain/user";
import { UserRepository } from "src/utils/repositories/user.repository";

export interface RefreshTokenResponse {
  token: string;
}

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async refreshToken(user: AuthUser): Promise<RefreshTokenResponse> {
    const userInDb = await this.userRepository.findByEmail(user.email);

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
      return this.userRepository.getPaginated(page, pageSize);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}
