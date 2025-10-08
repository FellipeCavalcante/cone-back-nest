import { RegisterUseCase } from "./use-cases/register";
import { LoginDto } from "./dtos/login.dto";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Public } from "../../config/guard/constants/constants";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginUseCase } from "./use-cases/login";

@Controller("api/v2/auth")
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
  ) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: LoginDto) {
    return await this.loginUseCase.execute(request);
  }

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: CreateUserDto) {
    return await this.registerUseCase.execute(request);
  }
}
