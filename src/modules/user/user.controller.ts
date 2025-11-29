import { Controller, Get } from "@nestjs/common";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { AuthUser } from "./domain/user";
import { UserService } from "./user.service";

@Controller("api/v1/user")
export class UserController {
  constructor(private service: UserService) {}

  @Get("reports")
  async reports() {
    return this.service.reports();
  }

  @Get("refresh-token")
  async refresh(@GetUser() user: AuthUser) {
    return this.service.refreshToken(user);
  }
}
