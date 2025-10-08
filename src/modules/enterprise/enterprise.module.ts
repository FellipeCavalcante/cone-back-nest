import { PrismaService } from "src/config/database/prisma.service";
import { EnterpriseController } from "./enterprise.controller";
import { Module } from "@nestjs/common";
import { CreateEnterpriseUseCase } from "./use-cases/create-enterprise";
import { GetAllEnterprisesUseCase } from "./use-cases/get-all-enterprises";
import { GetAllEnterprisesMembers } from "./use-cases/get-all-enterprise-members";

@Module({
  imports: [],
  controllers: [EnterpriseController],
  providers: [
    CreateEnterpriseUseCase,
    GetAllEnterprisesUseCase,
    GetAllEnterprisesMembers,
    PrismaService,
  ],
})
export class EnterpriseModule {}
