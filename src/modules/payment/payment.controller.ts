import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PaymentUseCaseSelectPlan } from "./use-cases/select-plan";
import { AuthGuard } from "src/config/guard/auth.guard";
import { SelectPlanDto } from "./dtos/select-plan-body.dto";
import { AuthUser } from "../user/domain/user";

@UseGuards(AuthGuard)
@Controller("api/v1/payment")
export class PaymentController {
  constructor(private selectPlanUseCase: PaymentUseCaseSelectPlan) {}

  @Post("select-plan")
  @HttpCode(HttpStatus.OK)
  async selectPlan(
    @Req() req: { user: AuthUser },
    @Body() body: SelectPlanDto,
  ) {
    const user_id = req.user.sub;

    return await this.selectPlanUseCase.execute({
      user_id,
      plan_id: body.plan_id,
      payment_method_id: body.payment_method_id,
    });
  }
}
