import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { CreateProjectUseCase } from "./use-cases/create-project";
import { PrismaService } from "src/config/database/prisma.service";

@Module({
  controllers: [ProjectController],
  providers: [PrismaService, CreateProjectUseCase],
  exports: [],
})
export class ProjectModule {}
