import { Controller, Get } from "@nestjs/common";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { RefreshTokenUseCase } from "./use-cases/refresh-token";
import { UserReportsUseCase } from "./use-cases/user-reports";
import { AuthUser } from "./domain/user";

@Controller("api/v2/user")
export class UserController {
  constructor(
    private refreshTokenUseCase: RefreshTokenUseCase,
    private useReportsUseCase: UserReportsUseCase,
  ) {}

  @Get("reports")
  async reports() {
    return this.useReportsUseCase.execute();
  }

  @Get("refresh-token")
  async refresh(@GetUser() user: AuthUser) {
    return this.refreshTokenUseCase.execute(user);
  }
}
