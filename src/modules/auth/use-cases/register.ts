import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import * as bcrypt from "bcrypt";
import { EmailService } from "src/config/email/email.service";
import { registerEmailTemplate } from "../template/register-email";
import { S3StorageService } from "src/config/aws/s3-storage.service";

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
    private s3: S3StorageService,
  ) {}

  async execute(
    {
      name,
      email,
      password,
      type,
    }: {
      name: string;
      email: string;
      password: string;
      type?: string;
    },
    profilePhoto?: Express.Multer.File,
  ): Promise<RegisterResponse> {
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new UnauthorizedException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!type) {
      type = "CLIENT";
    }

    type = type.toUpperCase();

    if (type !== "ADMIN" && type !== "MANAGER" && type !== "CLIENT") {
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

    if (profilePhoto) {
      const key = await this.s3.uploadFile(
        profilePhoto,
        `profile-photos/${user.id}`,
      );

      // cria attachment
      const attachment = await this.prismaService.attachment.create({
        data: {
          file_name: profilePhoto.originalname,
          file_type: profilePhoto.mimetype,
          file_size: profilePhoto.size,
          s3_key: key,
        },
      });

      // cria profile_photo
      await this.prismaService.profilePhoto.create({
        data: {
          user_id: user.id,
          attachment_id: attachment.id,
        },
      });
    }

    // await this.emailService.send({
    //   to: user.email,
    //   subject: "Bem-vindo ao Cone",
    //   html: registerEmailTemplate(user.name, "https://google.com"),
    // });

    return { id: user.id, name: user.name, email: user.email, type: user.type };
  }
}
