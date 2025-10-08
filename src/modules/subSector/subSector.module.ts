import { Module } from "@nestjs/common";
import { SubSectorController } from "./subSecotr.controller";
import { CreateSubSectorUseCase } from "./use-cases/create-subSector";
import { AddUserInSubSectorUseCase } from "./use-cases/add-user";

@Module({
  imports: [],
  controllers: [SubSectorController],
  providers: [CreateSubSectorUseCase, AddUserInSubSectorUseCase],
})
export class SubSectorModule {}
