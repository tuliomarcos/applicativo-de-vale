import { PrismaService } from '../database/prisma.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
export declare class EmpresaService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createEmpresaDto: CreateEmpresaDto): Promise<{
        id: string;
        name: string;
        cnpj: string;
        address: string;
        phone: string;
        primaryColor: string;
        secondaryColor: string;
        logoUrl: string | null;
        userId: string;
        createdAt: Date;
    }>;
    getByUserId(userId: string): Promise<{
        id: string;
        name: string;
        cnpj: string;
        address: string;
        phone: string;
        primaryColor: string;
        secondaryColor: string;
        logoUrl: string | null;
        userId: string;
        createdAt: Date;
    } | null>;
    update(id: string, updateEmpresaDto: UpdateEmpresaDto): Promise<{
        id: string;
        name: string;
        cnpj: string;
        address: string;
        phone: string;
        primaryColor: string;
        secondaryColor: string;
        logoUrl: string | null;
        userId: string;
        createdAt: Date;
    }>;
    private getEmpresaWithLogo;
}
