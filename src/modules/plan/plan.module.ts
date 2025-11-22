import { Module } from "@nestjs/common";
import { PlanController } from "./plan.controller";
import { ListPlansUseCase } from "./use-cases/list-plans";
import { GetPlanDetailsUseCase } from "./use-cases/plan-details";

@Module({
  imports: [],
  controllers: [PlanController],
  providers: [ListPlansUseCase, GetPlanDetailsUseCase],
})
export class PlanModule {}
