import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class ListPlansUseCase {
  constructor(private prisma: PrismaService) {}

  async execute() {
    try {
      const plans = await this.prisma.plan.findMany({
        orderBy: { created_at: "desc" },
      });

      return { data: plans };
    } catch (error: any) {}
  }
}
