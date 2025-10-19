import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import * as bcrypt from "bcrypt";
import { EmailService } from "src/config/email/email.service";
import { registerEmailTemplate } from "../template/register-email";

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  type: string | null;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
  ) {}

  async execute({
    name,
    email,
    password,
    type,
  }: {
    name: string;
    email: string;
    password: string;
    type?: string;
  }): Promise<RegisterResponse> {
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new UnauthorizedException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!type) {
      type = "WORKER";
    }

    type = type.toUpperCase();

    if (
      type !== "WORKER" &&
      type !== "ADMIN" &&
      type !== "MANAGER" &&
      type !== "CLIENT"
    ) {
      throw new BadRequestException("Invalid user type");
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        type: type || null,
      },
    });

    await this.emailService.send({
      to: user.email,
      subject: "Bem-vindo ao Cone",
      html: registerEmailTemplate(user.name, "https://google.com"),
    });

    return { id: user.id, name: user.name, email: user.email, type: user.type };
  }
}
