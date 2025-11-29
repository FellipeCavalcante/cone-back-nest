import { Module } from "@nestjs/common";
import { PlanController } from "./plan.controller";
import { PlanService } from "./plan.service";
import { InvoiceService } from "../invoice/invoice.service";
import { PaymentService } from "../payment/payment.service";
import { PrismaService } from "src/config/database/prisma.service";
import { S3StorageService } from "src/config/aws/s3-storage.service";
import { AwsS3Module } from "src/config/aws/aws-s3.module";
import { PlanRepository } from "src/utils/repositories/plan.repository";
import { PaymentMethodRepository } from "src/utils/repositories/paymentMethod.repository";
import { UserPlanRepository } from "src/utils/repositories/userPlanRepository";

@Module({
  imports: [AwsS3Module],
  controllers: [PlanController],
  providers: [
    PlanService,
    PrismaService,
    InvoiceService,
    PaymentService,
    S3StorageService,
    PlanRepository,
    PaymentMethodRepository,
    UserPlanRepository,
  ],
})
export class PlanModule {}
