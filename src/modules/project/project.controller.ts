import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateProjectUseCase } from "./use-cases/create-project";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";

@Controller("api/v2/project")
export class ProjectController {
  constructor(private createUseCase: CreateProjectUseCase) {}

  @Post("/create")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: UserDomain, @Body() body: CreateProjectDto) {
    return this.createUseCase.execute({ user, ...body });
  }
}
