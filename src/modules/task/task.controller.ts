import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";

@Controller("api/v2/task")
export class TaskController {
  constructor(private service: TaskService) {}

  @Post("/create")
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: UserDomain, @Body() body: CreateTaskDto) {
    return this.service.create({ user, ...body });
  }
}
