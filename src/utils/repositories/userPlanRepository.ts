import { Injectable } from "@nestjs/common";
import { addMonths } from "date-fns";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class UserPlanRepository {
  constructor(private prisma: PrismaService) {}

  create(userId: string, planId: string, paymentMethodId: string) {
    const now = new Date();

    return this.prisma.userPlan.create({
      data: {
        user_id: userId,
        plan_id: planId,
        payment_method_id: paymentMethodId,
        start_date: now,
        next_billing_date: addMonths(now, 1),
        status: "active",
      },
    });
  }
}
