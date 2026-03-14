import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(user: any, createClientDto: CreateClientDto): Promise<{
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
    findAll(search?: string, page?: string, limit?: string): Promise<{
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
