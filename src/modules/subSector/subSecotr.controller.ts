import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateSubSectorDto } from "./dtos/create-subSector";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { CreateSubSectorUseCase } from "./use-cases/create-subSector";
import { AddUserInSubSectorUseCase } from "./use-cases/add-user";
import { UpdateSubSectorUseCase } from "./use-cases/update-subSector";
import { UpdateSubSectorDto } from "./dtos/update-subSector";

@Controller("api/v2/subSector")
export class SubSectorController {
  constructor(
    private createSubSectorUseCase: CreateSubSectorUseCase,
    private addUserUseCase: AddUserInSubSectorUseCase,
    private updateSubSectorUseCase: UpdateSubSectorUseCase,
  ) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: UserDomain,
    @Body() request: CreateSubSectorDto,
  ) {
    return this.createSubSectorUseCase.execute({ user, ...request });
  }

  @Post("add-users/:subSectorId")
  @HttpCode(HttpStatus.OK)
  async addUsers(
    @GetUser() user: UserDomain,
    @Body() request: { memberId: string },
    @Param("subSectorId") subSectorId: string,
  ) {
    return this.addUserUseCase.execute(user, subSectorId, request.memberId);
  }

  @Patch("update/:subSectorId")
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() request: UpdateSubSectorDto,
    @Param("subSectorId") subSectorId: string,
  ) {
    return this.updateSubSectorUseCase.execute(subSectorId, request.name);
  }
}
