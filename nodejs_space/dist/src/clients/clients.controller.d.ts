import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(user: any, createClientDto: CreateClientDto): Promise<any>;
    findAll(search?: string, page?: string, limit?: string): Promise<{
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
