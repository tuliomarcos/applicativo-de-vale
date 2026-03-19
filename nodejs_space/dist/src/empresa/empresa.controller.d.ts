import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
import type { AuthUser, EmpresaResponse } from '../types/api';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    create(user: AuthUser, createEmpresaDto: CreateEmpresaDto): Promise<EmpresaResponse>;
    getEmpresa(user: AuthUser): Promise<EmpresaResponse | null>;
    update(id: string, updateEmpresaDto: UpdateEmpresaDto): Promise<EmpresaResponse>;
}
