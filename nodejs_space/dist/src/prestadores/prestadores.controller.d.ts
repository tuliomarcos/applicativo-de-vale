import { PrestadoresService } from './prestadores.service';
import { CreatePrestadorDto, UpdatePrestadorDto } from './dto/prestador.dto';
export declare class PrestadoresController {
    private readonly prestadoresService;
    constructor(prestadoresService: PrestadoresService);
    create(user: any, createPrestadorDto: CreatePrestadorDto): Promise<any>;
    findAll(search?: string, page?: string, limit?: string): Promise<{
        items: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePrestadorDto: UpdatePrestadorDto): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
