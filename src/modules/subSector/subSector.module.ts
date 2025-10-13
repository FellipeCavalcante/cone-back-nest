import { Module } from "@nestjs/common";
import { SubSectorController } from "./subSecotr.controller";
import { CreateSubSectorUseCase } from "./use-cases/create-subSector";
import { AddUserInSubSectorUseCase } from "./use-cases/add-user";
import { UpdateSubSectorUseCase } from "./use-cases/update-subSector";

@Module({
  imports: [],
  controllers: [SubSectorController],
  providers: [
    CreateSubSectorUseCase,
    AddUserInSubSectorUseCase,
    UpdateSubSectorUseCase,
  ],
})
export class SubSectorModule {}
