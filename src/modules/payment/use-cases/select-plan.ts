import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { CreatePaymentUseCase } from "./create-payment";
import { CreateUserPlanUseCase } from "./create-user-plan";
import { CreateInvoiceUseCase } from "./create-invoice";

@Injectable()
export class PaymentUseCaseSelectPlan {
  constructor(
    private prisma: PrismaService,
    private createPayment: CreatePaymentUseCase,
    private createInvoice: CreateInvoiceUseCase,
    private createUserPlan: CreateUserPlanUseCase,
  ) {}

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
      const payment = await this.createPayment.execute({
        user_id,
        amount: plan.price,
        payment_method_id,
      });

      // 4. generate invoice mock
      const invoice = await this.createInvoice.execute({
        user_id,
        payment_id: payment.id,
        amount: plan.price,
      });

      // 5. create user plan
      const userPlan = await this.createUserPlan.execute({
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
}
