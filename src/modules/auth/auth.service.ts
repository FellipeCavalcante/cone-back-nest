import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { S3StorageService } from "src/config/aws/s3-storage.service";
import { EmailService } from "src/config/email/email.service";
import { registerEmailTemplate } from "./template/register-email";
import * as bcrypt from "bcrypt";
import { UserRepository } from "./repositories/user.repository";
import { ProfilePhotoRepository } from "./repositories/profile-photo.repository";
import { AttachmentRepository } from "./repositories/attachment.repository";

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  type: string | null;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  type: string;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    private s3: S3StorageService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private profilePhotoRepository: ProfilePhotoRepository,
    private attachmentRepository: AttachmentRepository,
  ) {}

  async register(
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
    const userExists = await this.userRepository.findByEmail(email);
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

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      type,
    });

    if (profilePhoto) {
      const key = await this.s3.uploadFile(
        profilePhoto,
        `profile-photos/${user.id}`,
      );

      const attachment = await this.attachmentRepository.createAttachment({
        file_name: profilePhoto.originalname,
        file_type: profilePhoto.mimetype,
        file_size: profilePhoto.size,
        s3_key: key,
      });

      await this.profilePhotoRepository.linkPhotoToUser(user.id, attachment.id);
    }

    await this.emailService.send({
      to: user.email,
      subject: "Bem-vindo ao Cone",
      html: registerEmailTemplate(user.name, "https://google.com"),
    });

    return { id: user.id, name: user.name, email: user.email, type: user.type };
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);

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
}
