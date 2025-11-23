import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create({
    user_id,
    amount,
    payment_method_id,
  }: {
    user_id: string;
    amount: number;
    payment_method_id: string;
  }) {
    const isApproved = Math.random() < 0.98;

    const mockGatewayChargeId = isApproved
      ? `ch_${Math.random().toString(36).slice(2)}`
      : null;

    const status = isApproved ? "paid" : "failed";

    const payment = await this.prisma.payment.create({
      data: {
        user_id,
        payment_method_id,
        amount,
        status,
        gateway: "mock_gateway",
        gateway_charge_id: mockGatewayChargeId,
      },
    });

    if (!isApproved) {
      throw new Error("Payment failed");
    }

    return payment;
  }

  async listMethods() {
    try {
      const methods = await this.prisma.paymentMethod.findMany({});

      return {
        data: methods,
      };
    } catch (error: any) {
      throw Error();
    }
  }
}
