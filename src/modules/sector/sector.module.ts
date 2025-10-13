import { Module } from "@nestjs/common";
import { SectorController } from "./sector.controller";
import { PrismaService } from "src/config/database/prisma.service";
import { CreateSectorUseCase } from "./use-cases/create-sector";
import { GetAllSectorsUseCase } from "./use-cases/get-all-sectors";
import { GetSectorDetailsUseCase } from "./use-cases/get-sector-details";
import { EditSectorUseCase } from "./use-cases/edit-sector";

@Module({
  controllers: [SectorController],
  providers: [
    CreateSectorUseCase,
    PrismaService,
    GetAllSectorsUseCase,
    GetSectorDetailsUseCase,
    EditSectorUseCase,
  ],
  exports: [],
})
export class SectorModule {}
