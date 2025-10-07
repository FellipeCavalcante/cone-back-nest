import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { SubSectorService } from "./subSector.service";
import { CreateSubSectorDto } from "./dtos/create-subSector";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";

@Controller("api/v2/subSector")
export class SubSectorController {
  constructor(private service: SubSectorService) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: UserDomain,
    @Body() request: CreateSubSectorDto,
  ) {
    return this.service.create({ user, ...request });
  }

  @Post("add-users")
  @HttpCode(HttpStatus.OK)
  async addUsers(
    @GetUser() user: UserDomain,
    @Body() request: { subSectorId: string; memberId: string },
  ) {
    return this.service.addMemberToSubSector(
      user,
      request.subSectorId,
      request.memberId,
    );
  }
}
