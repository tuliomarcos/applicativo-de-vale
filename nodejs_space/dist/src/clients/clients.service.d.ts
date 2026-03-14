import { PrismaService } from '../database/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
export declare class ClientsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createClientDto: CreateClientDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        cnpj: string;
        address: string;
        createdById: string;
    }>;
    findAll(search?: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            name: string;
            email: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            cnpj: string;
            address: string;
            createdById: string;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        cnpj: string;
        address: string;
        createdById: string;
    }>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        cnpj: string;
        address: string;
        createdById: string;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
