import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateProjectUseCase } from "./use-cases/create-project";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { AddUserUseCaseInProject } from "./use-cases/add-user";
import { UpdateProjectUseCase } from "./use-cases/update-project";
import { UpdateProjectDto } from "./dtos/update-project.dto";

@Controller("api/v2/project")
export class ProjectController {
  constructor(
    private createUseCase: CreateProjectUseCase,
    private addUserUseCase: AddUserUseCaseInProject,
    private updateUseCase: UpdateProjectUseCase,
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

  @Patch("update/:id")
  @HttpCode(HttpStatus.OK)
  async update(
    @GetUser() user: UserDomain,
    @Param("id") id: string,
    @Body() body: UpdateProjectDto,
  ) {
    return this.updateUseCase.execute({ user, id, ...Body });
  }
}
