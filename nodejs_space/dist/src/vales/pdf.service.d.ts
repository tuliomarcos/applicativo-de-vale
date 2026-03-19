import { PrismaService } from '../database/prisma.service';
import { ValesService } from './vales.service';
import { EmpresaService } from '../empresa/empresa.service';
import { PdfResponse } from '../types/api';
export declare class PdfService {
    private prisma;
    private valesService;
    private empresaService;
    private readonly logger;
    constructor(prisma: PrismaService, valesService: ValesService, empresaService: EmpresaService);
    generatePdf(userId: string, valeIds: string[]): Promise<PdfResponse>;
    private createPdfBuffer;
}
