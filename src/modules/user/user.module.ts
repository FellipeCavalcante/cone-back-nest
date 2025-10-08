import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { RefreshTokenUseCase } from "./use-cases/refresh-token";
import { UserReportsUseCase } from "./use-cases/user-reports";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [RefreshTokenUseCase, UserReportsUseCase],
})
export class UserModule {}
