import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";

@Injectable()
export class S3StorageService {
  private bucket: string;

  constructor(
    @Inject("S3_CLIENT") private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {
    const bucketName = this.configService.get<string>("AWS_S3_BUCKET");
    if (!bucketName) {
      throw new Error("AWS S3 bucket name is not configured");
    }
    this.bucket = bucketName;
  }

  // UPLOAD
  async uploadFile(
    file: Express.Multer.File,
    folderPath?: string,
  ): Promise<string> {
    if (!file?.buffer) {
      throw new BadRequestException("Invalid file provided");
    }

    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${file.originalname}`;
    const key = folderPath ? `${folderPath}/${uniqueName}` : uniqueName;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }

  // DOWNLOAD
  async downloadFile(key: string): Promise<Buffer> {
    const response = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    const stream = response.Body as Readable;

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  // GET FILE URL
  async getFileUrl(key: string): Promise<string> {
    return `https://${this.bucket}.s3.${await this.getRegion()}.amazonaws.com/${key}`;
  }

  private async getRegion(): Promise<string> {
    return this.configService.get<string>("AWS_S3_REGION") || "us-east-1";
  }

  async getPresignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: expiresInSeconds,
    });
  }

  // DELETE
  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  // LIST FILES
  async listFiles(folderPath?: string): Promise<string[]> {
    const response = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: folderPath,
      }),
    );

    return (
      response.Contents?.map((obj) => obj.Key as string).filter(Boolean) ?? []
    );
  }

  // CHECK IF FILE EXISTS
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch (error: any) {
      if (error.name === "NoSuchKey") {
        return false;
      }
      throw error;
    }
  }
}
