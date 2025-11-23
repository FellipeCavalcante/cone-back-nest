import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentUseCaseSelectPlan } from "./use-cases/select-plan";
import { CreateInvoiceUseCase } from "./use-cases/create-invoice";
import { CreateUserPlanUseCase } from "./use-cases/create-user-plan";
import { CreatePaymentUseCase } from "./use-cases/create-payment";
import { AwsS3Module } from "src/config/aws/aws-s3.module";

@Module({
  imports: [AwsS3Module],
  controllers: [PaymentController],
  providers: [
    PaymentUseCaseSelectPlan,
    CreateInvoiceUseCase,
    CreateUserPlanUseCase,
    CreatePaymentUseCase,
  ],
})
export class PaymentModule {}
