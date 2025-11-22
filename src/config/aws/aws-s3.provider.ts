import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";

export const AwsS3Provider: Provider = {
  provide: "S3_CLIENT",
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const accessKey = config.get<string>("AWS_S3_ACCESS_KEY");
    const secretKey = config.get<string>("AWS_S3_SECRET_KEY");
    const region = config.get<string>("AWS_S3_REGION");

    if (!accessKey || !secretKey || !region) {
      throw new Error(
        "AWS S3 configuration is missing required environment variables",
      );
    }

    return new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
  },
};
