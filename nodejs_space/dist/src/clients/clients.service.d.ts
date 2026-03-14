import { PrismaService } from '../database/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
export declare class ClientsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createClientDto: CreateClientDto): Promise<any>;
    findAll(search?: string, page?: number, limit?: number): Promise<{
        items: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
