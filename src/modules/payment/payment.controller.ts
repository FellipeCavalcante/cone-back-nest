import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/config/guard/auth.guard";
import { PaymentService } from "./payment.service";

@UseGuards(AuthGuard)
@Controller("api/v1/payment")
export class PaymentController {
  constructor(private service: PaymentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list() {
    return this.service.listMethods();
  }
}
