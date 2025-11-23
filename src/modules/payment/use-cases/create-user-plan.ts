import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { addMonths } from "date-fns";

@Injectable()
export class CreateUserPlanUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({
    user_id,
    plan_id,
    payment_method_id,
  }: {
    user_id: string;
    plan_id: string;
    payment_method_id: string;
  }) {
    try {
      const now = new Date();

      return await this.prisma.userPlan.create({
        data: {
          user_id,
          plan_id,
          payment_method_id,
          start_date: now,
          next_billing_date: addMonths(now, 1),
          status: "active",
        },
      });
    } catch (error: any) {
      throw error;
    }
  }
}
