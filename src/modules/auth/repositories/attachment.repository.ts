import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";

@Injectable()
export class AttachmentRepository {
  constructor(private prisma: PrismaService) {}

  createAttachment(data: {
    file_name: string;
    file_type: string;
    file_size: number;
    s3_key: string;
  }) {
    return this.prisma.attachment.create({ data });
  }
}
