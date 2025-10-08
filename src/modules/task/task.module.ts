import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { PrismaService } from "src/config/database/prisma.service";
import { CreateTaskUseCase } from "./use-cases/create-task";

@Module({
  controllers: [TaskController],
  providers: [CreateTaskUseCase, PrismaService],
})
export class TaskModule {}
