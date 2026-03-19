import { ValesService } from './vales.service';
import { PdfService } from './pdf.service';
import { EmailService } from './email.service';
import { CreateValeViagemDto, CreateValeDiariaDto, UpdateValeDto } from './dto/vale.dto';
import { GeneratePdfDto, SendEmailDto, ShareLinkDto } from './dto/vale-actions.dto';
import type { AuthUser, PaginatedResponse, PdfResponse, SendEmailResponse, ShareLinkResponse, SuccessResponse, ValeResponse } from '../types/api';
export declare class ValesController {
    private readonly valesService;
    private readonly pdfService;
    private readonly emailService;
    constructor(valesService: ValesService, pdfService: PdfService, emailService: EmailService);
    createValeViagem(user: AuthUser, createDto: CreateValeViagemDto): Promise<ValeResponse>;
    createValeDiaria(user: AuthUser, createDto: CreateValeDiariaDto): Promise<ValeResponse>;
    findAll(type?: string, search?: string, page?: string, limit?: string): Promise<PaginatedResponse<ValeResponse>>;
    findOne(id: string): Promise<ValeResponse>;
    update(id: string, user: AuthUser, updateDto: UpdateValeDto): Promise<ValeResponse>;
    delete(id: string, user: AuthUser): Promise<SuccessResponse>;
    generatePdf(user: AuthUser, dto: GeneratePdfDto): Promise<PdfResponse>;
    sendEmail(user: AuthUser, dto: SendEmailDto): Promise<SendEmailResponse>;
    generateShareLink(user: AuthUser, dto: ShareLinkDto): Promise<ShareLinkResponse>;
}
