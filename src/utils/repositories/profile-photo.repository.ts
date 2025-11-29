import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class ProfilePhotoRepository {
  constructor(private prisma: PrismaService) {}

  linkPhotoToUser(user_id: string, attachment_id: string) {
    return this.prisma.profilePhoto.create({
      data: { user_id, attachment_id },
    });
  }
}
