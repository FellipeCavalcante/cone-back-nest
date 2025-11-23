import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/database/prisma.service";
import { S3StorageService } from "src/config/aws/s3-storage.service";

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    private prisma: PrismaService,
    private s3: S3StorageService,
  ) {}

  async execute({
    payment_id,
    user_id,
    amount,
  }: {
    payment_id: string;
    user_id: string;
    amount: number;
  }) {
    const pdfBuffer = Buffer.from(
      `MOCK INVOICE\nPayment: ${payment_id}\nAmount: ${amount}`,
      "utf-8",
    );

    const key = `invoices/${user_id}/${payment_id}.pdf`;

    await this.s3.uploadBuffer(pdfBuffer, key);

    const pdfUrl = await this.s3.getFileUrl(key);

    return await this.prisma.invoice.create({
      data: {
        payment_id,
        user_id,
        amount,
        status: "paid",
        pdf_url: pdfUrl,
        due_date: null,
      },
    });
  }
}
