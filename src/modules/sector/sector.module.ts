import { Module } from "@nestjs/common";
import { SectorController } from "./sector.controller";
import { PrismaService } from "src/config/database/prisma.service";
import { CreateSectorUseCase } from "./use-cases/create-sector";
import { GetAllSectorsUseCase } from "./use-cases/get-all-sectors";

@Module({
  controllers: [SectorController],
  providers: [CreateSectorUseCase, PrismaService, GetAllSectorsUseCase],
  exports: [],
})
export class SectorModule {}
