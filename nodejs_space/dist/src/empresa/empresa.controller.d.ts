import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    create(user: any, createEmpresaDto: CreateEmpresaDto): Promise<{
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
    getEmpresa(user: any): Promise<{
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
}
