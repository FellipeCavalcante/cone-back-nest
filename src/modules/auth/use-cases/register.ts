import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class RegisterUseCase {
  constructor(private prismaService: PrismaService) {}

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
  }): Promise<{
    id: string;
    name: string;
    email: string;
    type: string | null;
  }> {
    const userExists = await this.prismaService.users.findUnique({
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

    const user = await this.prismaService.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        type: type || null,
      },
    });

    return { id: user.id, name: user.name, email: user.email, type: user.type };
  }
}
