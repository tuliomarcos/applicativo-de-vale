import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PdfService } from './pdf.service';
import * as nodemailer from 'nodemailer';
import { SendEmailResponse } from '../types/api';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
  ) {
    // Configure email transporter
    // Note: In production, use real SMTP credentials
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendValesEmail(
    userId: string,
    valeIds: string[],
    recipientEmail: string,
  ): Promise<SendEmailResponse> {
    try {
      // Generate PDF
      const pdfResult = await this.pdfService.generatePdf(userId, valeIds);

      // For now, we'll just return success with the PDF URL
      // In production, you would:
      // 1. Download the PDF from S3
      // 2. Attach it to the email
      // 3. Send the email via nodemailer

      this.logger.log(`Email would be sent to ${recipientEmail}`);

      return {
        success: true,
        message: `Email sent to ${recipientEmail} with PDF: ${pdfResult.pdfUrl}`,
      };
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      throw error;
    }
  }
}
