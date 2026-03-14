import { PrismaService } from '../database/prisma.service';
export declare class DashboardService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalVales: number;
        totalClients: number;
        recentVales: ({
            client: {
                id: string;
                name: string;
                email: string;
                cnpj: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.ValeType;
            createdById: string;
            clientId: string;
            truckPlate: string | null;
            driverName: string | null;
            tripType: import("@prisma/client").$Enums.TripType | null;
            workLocation: string;
            date: Date;
            operatorName: string | null;
            morningStart: string | null;
            morningEnd: string | null;
            afternoonStart: string | null;
            afternoonEnd: string | null;
            totalHours: number | null;
            equipment: string | null;
            signaturePath: string;
        })[];
    }>;
}
