import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    create(user: any, createEmpresaDto: CreateEmpresaDto): Promise<{
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
    getEmpresa(user: any): Promise<{
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
}
