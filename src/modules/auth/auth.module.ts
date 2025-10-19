import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../../config/guard/constants/constants";
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/config/database/prisma.service";
import { LoginUseCase } from "./use-cases/login";
import { RegisterUseCase } from "./use-cases/register";
import { EmailModule } from "src/config/email/email.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants?.secret || process.env.SECRET_KEY,
      signOptions: { expiresIn: "4h" },
    }),
    EmailModule
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, RegisterUseCase, PrismaService],
})
export class AuthModule {}
