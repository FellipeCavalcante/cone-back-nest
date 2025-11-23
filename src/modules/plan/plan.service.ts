import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async listPlans() {
    try {
      const plans = await this.prisma.plan.findMany({
        orderBy: { created_at: "desc" },
      });

      return { data: plans };
    } catch (error: any) {}
  }

  async planDetails(planId: string) {
    try {
      const plan = await this.prisma.plan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        throw new NotFoundException("Plan not found");
      }
      return { data: plan };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
    throw new Error();
  }
}
