import { ValesService } from './vales.service';
import { PdfService } from './pdf.service';
import { EmailService } from './email.service';
import { CreateValeViagemDto, CreateValeDiariaDto, UpdateValeDto } from './dto/vale.dto';
import { GeneratePdfDto, SendEmailDto, ShareLinkDto } from './dto/vale-actions.dto';
export declare class ValesController {
    private readonly valesService;
    private readonly pdfService;
    private readonly emailService;
    constructor(valesService: ValesService, pdfService: PdfService, emailService: EmailService);
    createValeViagem(user: any, createDto: CreateValeViagemDto): Promise<{
        id: any;
        type: any;
        clientId: any;
        client: any;
        workLocation: any;
        date: any;
        signatureUrl: string;
        createdById: any;
        createdAt: any;
        truckPlate: any;
        driverName: any;
        tripType: any;
        operatorName: any;
        morningStart: any;
        morningEnd: any;
        afternoonStart: any;
        afternoonEnd: any;
        totalHours: any;
        equipment: any;
    }>;
    createValeDiaria(user: any, createDto: CreateValeDiariaDto): Promise<{
        id: any;
        type: any;
        clientId: any;
        client: any;
        workLocation: any;
        date: any;
        signatureUrl: string;
        createdById: any;
        createdAt: any;
        truckPlate: any;
        driverName: any;
        tripType: any;
        operatorName: any;
        morningStart: any;
        morningEnd: any;
        afternoonStart: any;
        afternoonEnd: any;
        totalHours: any;
        equipment: any;
    }>;
    findAll(type?: string, search?: string, page?: string, limit?: string): Promise<{
        items: any[];
        total: any;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: any;
        type: any;
        clientId: any;
        client: any;
        workLocation: any;
        date: any;
        signatureUrl: string;
        createdById: any;
        createdAt: any;
        truckPlate: any;
        driverName: any;
        tripType: any;
        operatorName: any;
        morningStart: any;
        morningEnd: any;
        afternoonStart: any;
        afternoonEnd: any;
        totalHours: any;
        equipment: any;
    }>;
    update(id: string, user: any, updateDto: UpdateValeDto): Promise<{
        id: any;
        type: any;
        clientId: any;
        client: any;
        workLocation: any;
        date: any;
        signatureUrl: string;
        createdById: any;
        createdAt: any;
        truckPlate: any;
        driverName: any;
        tripType: any;
        operatorName: any;
        morningStart: any;
        morningEnd: any;
        afternoonStart: any;
        afternoonEnd: any;
        totalHours: any;
        equipment: any;
    }>;
    delete(id: string, user: any): Promise<{
        success: boolean;
    }>;
    generatePdf(user: any, dto: GeneratePdfDto): Promise<{
        pdfUrl: string;
    }>;
    sendEmail(user: any, dto: SendEmailDto): Promise<{
        success: boolean;
        message: string;
    }>;
    generateShareLink(user: any, dto: ShareLinkDto): Promise<{
        pdfUrl: string;
        whatsappUrl: string;
    }>;
}
