import { PrismaService } from '../database/prisma.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
export declare class EmpresaService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createEmpresaDto: CreateEmpresaDto): Promise<{
        id: any;
        name: any;
        cnpj: any;
        address: any;
        phone: any;
        primaryColor: any;
        secondaryColor: any;
        logoUrl: string | null;
        userId: any;
        createdAt: any;
    }>;
    getByUserId(userId: string): Promise<{
        id: any;
        name: any;
        cnpj: any;
        address: any;
        phone: any;
        primaryColor: any;
        secondaryColor: any;
        logoUrl: string | null;
        userId: any;
        createdAt: any;
    } | null>;
    update(id: string, updateEmpresaDto: UpdateEmpresaDto): Promise<{
        id: any;
        name: any;
        cnpj: any;
        address: any;
        phone: any;
        primaryColor: any;
        secondaryColor: any;
        logoUrl: string | null;
        userId: any;
        createdAt: any;
    }>;
    private getEmpresaWithLogo;
}
