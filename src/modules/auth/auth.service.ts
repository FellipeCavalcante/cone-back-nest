import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/config/database/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    id: string;
    name: string;
    email: string;
    type: string;
    token: string;
  }> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      type: user.type,
      enterpriseId: user.enterprise_id,
      subSectorId: user.sub_sector_id,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type || "",
      token: token,
    };
  }

  async create({
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
