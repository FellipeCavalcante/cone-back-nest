import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { CreateProjectUseCase } from "./use-cases/create-project";
import { PrismaService } from "src/config/database/prisma.service";
import { AddUserUseCaseInProject } from "./use-cases/add-user";
import { UpdateProjectUseCase } from "./use-cases/update-project";

@Module({
  controllers: [ProjectController],
  providers: [
    PrismaService,
    CreateProjectUseCase,
    AddUserUseCaseInProject,
    UpdateProjectUseCase,
  ],
  exports: [],
})
export class ProjectModule {}
