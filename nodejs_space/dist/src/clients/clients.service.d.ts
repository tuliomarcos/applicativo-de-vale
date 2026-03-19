import { PrismaService } from '../database/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { ClientResponse, PaginatedResponse, SuccessResponse } from '../types/api';
export declare class ClientsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createClientDto: CreateClientDto): Promise<ClientResponse>;
    findAll(search?: string, page?: number, limit?: number): Promise<PaginatedResponse<ClientResponse>>;
    findOne(id: string): Promise<ClientResponse>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ClientResponse>;
    delete(id: string): Promise<SuccessResponse>;
}
