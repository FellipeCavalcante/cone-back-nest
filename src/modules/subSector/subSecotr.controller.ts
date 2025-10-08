import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateSubSectorDto } from "./dtos/create-subSector";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { CreateSubSectorUseCase } from "./use-cases/create-subSector";
import { AddUserInSubSectorUseCase } from "./use-cases/add-user";

@Controller("api/v2/subSector")
export class SubSectorController {
  constructor(
    private createSubSectorUseCase: CreateSubSectorUseCase,
    private addUserUseCase: AddUserInSubSectorUseCase,
  ) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: UserDomain,
    @Body() request: CreateSubSectorDto,
  ) {
    return this.createSubSectorUseCase.execute({ user, ...request });
  }

  @Post("add-users")
  @HttpCode(HttpStatus.OK)
  async addUsers(
    @GetUser() user: UserDomain,
    @Body() request: { subSectorId: string; memberId: string },
  ) {
    return this.addUserUseCase.execute(
      user,
      request.subSectorId,
      request.memberId,
    );
  }
}
