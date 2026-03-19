import { PrismaService } from '../database/prisma.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
import { EmpresaResponse } from '../types/api';
export declare class EmpresaService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createEmpresaDto: CreateEmpresaDto): Promise<EmpresaResponse>;
    getByUserId(userId: string): Promise<EmpresaResponse | null>;
    update(id: string, updateEmpresaDto: UpdateEmpresaDto): Promise<EmpresaResponse>;
    private getEmpresaWithLogo;
}
