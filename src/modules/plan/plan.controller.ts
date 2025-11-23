import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { Public } from "src/config/guard/constants/constants";
import { PlanService } from "./plan.service";

@Controller("api/v1/plan")
export class PlanController {
  constructor(private service: PlanService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async listPlans() {
    return await this.service.listPlans();
  }

  @Public()
  @Get(":planId")
  @HttpCode(HttpStatus.OK)
  async getPlanDetails(@Param("planId") planId: string) {
    return await this.service.planDetails(planId);
  }
}
