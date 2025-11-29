import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class PlanRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.plan.findMany({
      orderBy: { price: "desc" },
    });
  }

  findUnique(planId: string) {
    return this.prisma.plan.findUnique({
      where: { id: planId },
    });
  }
}
