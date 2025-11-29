import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(data: {
    name: string;
    email: string;
    password: string;
    type: string;
  }) {
    return this.prisma.user.create({ data });
  }
}
