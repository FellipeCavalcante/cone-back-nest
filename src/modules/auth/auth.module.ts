import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../../config/guard/constants/constants";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/config/database/prisma.service";
import { EmailModule } from "src/config/email/email.module";
import { AwsS3Module } from "src/config/aws/aws-s3.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants?.secret || process.env.SECRET_KEY,
      signOptions: { expiresIn: "4h" },
    }),
    EmailModule,
    AwsS3Module,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
