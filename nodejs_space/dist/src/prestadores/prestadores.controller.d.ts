import { PrestadoresService } from './prestadores.service';
import { CreatePrestadorDto, UpdatePrestadorDto } from './dto/prestador.dto';
import type { AuthUser, PaginatedResponse, PrestadorResponse, SuccessResponse } from '../types/api';
export declare class PrestadoresController {
    private readonly prestadoresService;
    constructor(prestadoresService: PrestadoresService);
    create(user: AuthUser, createPrestadorDto: CreatePrestadorDto): Promise<PrestadorResponse>;
    findAll(search?: string, page?: string, limit?: string): Promise<PaginatedResponse<PrestadorResponse>>;
    findOne(id: string): Promise<PrestadorResponse>;
    update(id: string, updatePrestadorDto: UpdatePrestadorDto): Promise<PrestadorResponse>;
    delete(id: string): Promise<SuccessResponse>;
}
