import { PrismaService } from '../database/prisma.service';
import { PdfService } from './pdf.service';
import { SendEmailResponse } from '../types/api';
export declare class EmailService {
    private prisma;
    private pdfService;
    private readonly logger;
    private transporter;
    constructor(prisma: PrismaService, pdfService: PdfService);
    sendValesEmail(userId: string, valeIds: string[], recipientEmail: string): Promise<SendEmailResponse>;
}
