import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class PaymentMethodRepository {
  constructor(private prisma: PrismaService) {}

  findUnique(id: string) {
    return this.prisma.paymentMethod.findUnique({
      where: { id },
    });
  }
}
