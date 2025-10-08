import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { CreateTaskUseCase } from "./use-cases/create-task";

@Controller("api/v2/task")
export class TaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}

  @Post("/create")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: UserDomain, @Body() body: CreateTaskDto) {
    return this.createTaskUseCase.execute({ user, ...body });
  }
}
