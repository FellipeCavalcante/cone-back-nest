import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { PrismaModule } from "./config/database/prisma.module";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "./modules/user/user.module";
import { AuthGuard } from "./config/guard/auth.guard";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "./config/email/email.module";
import { AwsS3Module } from "./config/aws/aws-s3.module";
import { PlanModule } from "./modules/plan/plan.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { InvoiceModule } from "./modules/invoice/invoice.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    EmailModule,
    AwsS3Module,
    PlanModule,
    PaymentModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
