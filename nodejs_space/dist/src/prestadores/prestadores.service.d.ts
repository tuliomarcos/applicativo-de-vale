import { PrismaService } from '../database/prisma.service';
import { CreatePrestadorDto, UpdatePrestadorDto } from './dto/prestador.dto';
import { PaginatedResponse, PrestadorResponse, SuccessResponse } from '../types/api';
export declare class PrestadoresService {
    private prisma;
    private readonly logger;
    private toResponse;
    constructor(prisma: PrismaService);
    private syncPrestadoresFromSignupUsers;
    create(userId: string, createPrestadorDto: CreatePrestadorDto): Promise<PrestadorResponse>;
    findAll(search?: string, page?: number, limit?: number): Promise<PaginatedResponse<PrestadorResponse>>;
    findOne(id: string): Promise<PrestadorResponse>;
    update(id: string, updatePrestadorDto: UpdatePrestadorDto): Promise<PrestadorResponse>;
    delete(id: string): Promise<SuccessResponse>;
}
