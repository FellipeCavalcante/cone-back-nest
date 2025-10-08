import { Controller, Get } from "@nestjs/common";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { UserDomain } from "./domain/user";
import { RefreshTokenUseCase } from "./use-cases/refresh-token";
import { UserReportsUseCase } from "./use-cases/user-reports";

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
  async refresh(@GetUser() user: UserDomain) {
    return this.refreshTokenUseCase.execute(user);
  }
}
