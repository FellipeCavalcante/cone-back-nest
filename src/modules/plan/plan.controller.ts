import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { Public } from "src/config/guard/constants/constants";
import { PlanService } from "./plan.service";
import { AuthUser } from "../user/domain/user";
import { SelectPlanDto } from "../payment/dtos/select-plan-body.dto";

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

  @Post("select-plan")
  @HttpCode(HttpStatus.OK)
  async selectPlan(
    @Req() req: { user: AuthUser },
    @Body() body: SelectPlanDto,
  ) {
    const user_id = req.user.sub;

    return await this.service.selectPlan({
      user_id,
      plan_id: body.plan_id,
      payment_method_id: body.payment_method_id,
    });
  }
}
