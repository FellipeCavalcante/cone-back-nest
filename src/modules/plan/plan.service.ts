import { UserPlanRepository } from "src/utils/repositories/userPlanRepository";
import { PaymentService } from "./../payment/payment.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InvoiceService } from "../invoice/invoice.service";
import { addMonths } from "date-fns";
import { PlanRepository } from "src/utils/repositories/plan.repository";
import { PaymentMethodRepository } from "src/utils/repositories/paymentMethod.repository";

@Injectable()
export class PlanService {
  constructor(
    private planRepository: PlanRepository,
    private paymentMethodRepository: PaymentMethodRepository,
    private userPlanRepository: UserPlanRepository,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
  ) {}

  async listPlans() {
    try {
      const plans = await this.planRepository.findAll();

      return { data: plans };
    } catch (error: any) {}
  }

  async planDetails(planId: string) {
    try {
      const plan = await this.planRepository.findUnique(planId);

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
      const plan = await this.planRepository.findUnique(plan_id);

      if (!plan) {
        throw new NotFoundException("Plan not found");
      }

      // verify payment method
      const paymentMethod =
        await this.paymentMethodRepository.findUnique(payment_method_id);

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
      return await this.userPlanRepository.create(
        user_id,
        plan_id,
        payment_method_id,
      );
    } catch (error: any) {
      throw error;
    }
  }
}
