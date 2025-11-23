import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./use.service";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
