import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AwsS3Provider } from "./aws-s3.provider";
import { S3StorageService } from "./s3-storage.service";

@Module({
  imports: [ConfigModule],
  providers: [AwsS3Provider, S3StorageService],
  exports: [S3StorageService],
})
export class AwsS3Module {}
