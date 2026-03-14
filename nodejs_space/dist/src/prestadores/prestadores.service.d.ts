import { PrismaService } from '../database/prisma.service';
import { CreatePrestadorDto, UpdatePrestadorDto } from './dto/prestador.dto';
export declare class PrestadoresService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createPrestadorDto: CreatePrestadorDto): Promise<any>;
    findAll(search?: string, page?: number, limit?: number): Promise<{
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
