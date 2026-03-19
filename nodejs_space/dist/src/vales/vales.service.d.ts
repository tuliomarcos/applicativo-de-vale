import { PrismaService } from '../database/prisma.service';
import { CreateValeViagemDto, CreateValeDiariaDto, UpdateValeDto } from './dto/vale.dto';
import { PaginatedResponse, ValeResponse, SuccessResponse, UserRoleValue, ClientSummary, ClientDetail, TripTypeValue, ValeTypeValue } from '../types/api';
export type ValeWithClientSummary = {
    id: string;
    type: ValeTypeValue;
    clientId: string;
    client: ClientSummary;
    workLocation: string;
    date: Date;
    signaturePath: string;
    createdById: string;
    createdAt: Date;
    truckPlate: string | null;
    driverName: string | null;
    tripType: TripTypeValue | null;
    operatorName: string | null;
    morningStart: string | null;
    morningEnd: string | null;
    afternoonStart: string | null;
    afternoonEnd: string | null;
    totalHours: number | null;
    equipment: string | null;
};
export type ValeWithClientDetail = Omit<ValeWithClientSummary, 'client'> & {
    client: ClientDetail;
};
export declare class ValesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createValeViagem(userId: string, createDto: CreateValeViagemDto): Promise<ValeResponse>;
    createValeDiaria(userId: string, createDto: CreateValeDiariaDto): Promise<ValeResponse>;
    findAll(type?: string, search?: string, page?: number, limit?: number): Promise<PaginatedResponse<ValeResponse>>;
    findOne(id: string): Promise<ValeResponse>;
    update(id: string, userId: string, userRole: UserRoleValue, updateDto: UpdateValeDto): Promise<ValeResponse>;
    delete(id: string, userRole: UserRoleValue): Promise<SuccessResponse>;
    private uploadSignature;
    formatValeResponse(vale: ValeWithClientSummary | ValeWithClientDetail): Promise<ValeResponse>;
    getValesByIds(valeIds: string[]): Promise<ValeResponse[]>;
}
