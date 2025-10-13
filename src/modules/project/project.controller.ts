import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { CreateProjectUseCase } from "./use-cases/create-project";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { AddUserUseCaseInProject } from "./use-cases/add-user";

@Controller("api/v2/project")
export class ProjectController {
  constructor(
    private createUseCase: CreateProjectUseCase,
    private addUserUseCase: AddUserUseCaseInProject,
  ) {}

  @Post("/create")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: UserDomain, @Body() body: CreateProjectDto) {
    return this.createUseCase.execute({ user, ...body });
  }

  @Post("add-user")
  @HttpCode(HttpStatus.OK)
  async addUsers(
    @GetUser() user: UserDomain,
    @Param("projectId") projectId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.addUserUseCase.execute(user, projectId, memberId);
  }
}
