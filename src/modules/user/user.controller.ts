import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { UserDomain } from "./domain/user";

@Controller("api/v2/user")
export class UserController {
  constructor(private service: UserService) {}

  @Get("reports")
  async reports() {
    return this.service.reports();
  }

  @Get("refresh-token")
  async refresh(@GetUser() user: UserDomain) {
    return this.service.refreshUsers(user);
  }
}
