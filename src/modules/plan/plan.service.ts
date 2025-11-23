import { PaymentService } from "./../payment/payment.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { InvoiceService } from "../invoice/invoice.service";
import { addMonths } from "date-fns";

@Injectable()
export class PlanService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
  ) {}

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

  async selectPlan({
    user_id,
    plan_id,
    payment_method_id,
  }: {
    user_id: string;
    plan_id: string;
    payment_method_id: string;
  }) {
    try {
      const plan = await this.prisma.plan.findUnique({
        where: { id: plan_id },
      });
      if (!plan) {
        throw new NotFoundException("Plan not found");
      }

      // verify payment method
      const paymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { id: payment_method_id },
      });
      if (!paymentMethod) {
        throw new NotFoundException("Payment method not found");
      }

      // mock payment processing
      const payment = await this.paymentService.create({
        user_id,
        amount: plan.price,
        payment_method_id,
      });

      // 4. generate invoice mock
      const invoice = await this.invoiceService.create({
        user_id,
        payment_id: payment.id,
        amount: plan.price,
      });

      // 5. create user plan
      const userPlan = await this.createUserPlan({
        user_id,
        plan_id,
        payment_method_id,
      });

      return {
        data: {
          payment,
          invoice,
          userPlan,
        },
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw error;
    }
  }

  async createUserPlan({
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
