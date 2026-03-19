import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import type { AuthUser, ClientResponse, PaginatedResponse, SuccessResponse } from '../types/api';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(user: AuthUser, createClientDto: CreateClientDto): Promise<ClientResponse>;
    findAll(search?: string, page?: string, limit?: string): Promise<PaginatedResponse<ClientResponse>>;
    findOne(id: string): Promise<ClientResponse>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ClientResponse>;
    delete(id: string): Promise<SuccessResponse>;
}
