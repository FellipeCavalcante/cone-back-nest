import { Module } from "@nestjs/common";
import { InvoiceService } from "./invoice.service";
import { PrismaService } from "src/config/database/prisma.service";
import { S3StorageService } from "src/config/aws/s3-storage.service";
import { AwsS3Module } from "src/config/aws/aws-s3.module";

@Module({
  exports: [],
  imports: [AwsS3Module],
  providers: [InvoiceService, PrismaService, S3StorageService],
})
export class InvoiceModule {}
