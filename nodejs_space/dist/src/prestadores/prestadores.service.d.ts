import { PrismaService } from '../database/prisma.service';
import { CreatePrestadorDto, UpdatePrestadorDto } from './dto/prestador.dto';
export declare class PrestadoresService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, createPrestadorDto: CreatePrestadorDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        createdById: string;
        document: string;
        documentType: import("@prisma/client").$Enums.DocumentType;
    }>;
    findAll(search?: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            name: string;
            email: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            createdById: string;
            document: string;
            documentType: import("@prisma/client").$Enums.DocumentType;
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
        address: string;
        createdById: string;
        document: string;
        documentType: import("@prisma/client").$Enums.DocumentType;
    }>;
    update(id: string, updatePrestadorDto: UpdatePrestadorDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        createdById: string;
        document: string;
        documentType: import("@prisma/client").$Enums.DocumentType;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
