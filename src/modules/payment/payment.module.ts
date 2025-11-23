import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { AwsS3Module } from "src/config/aws/aws-s3.module";
import { PaymentService } from "./payment.service";
import { PrismaService } from "src/config/database/prisma.service";
import { S3StorageService } from "src/config/aws/s3-storage.service";

@Module({
  imports: [AwsS3Module],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, S3StorageService],
})
export class PaymentModule {}
