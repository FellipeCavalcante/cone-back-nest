import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ListPlansUseCase } from "./use-cases/list-plans";
import { Public } from "src/config/guard/constants/constants";
import { GetPlanDetailsUseCase } from "./use-cases/plan-details";

@Controller("api/v1/plan")
export class PlanController {
  constructor(
    private listPlansUseCase: ListPlansUseCase,
    private getPlanDetailsUseCase: GetPlanDetailsUseCase,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async listPlans() {
    return await this.listPlansUseCase.execute();
  }

  @Public()
  @Get(":planId")
  @HttpCode(HttpStatus.OK)
  async getPlanDetails(@Param("planId") planId: string) {
    return await this.getPlanDetailsUseCase.execute(planId);
  }
}
