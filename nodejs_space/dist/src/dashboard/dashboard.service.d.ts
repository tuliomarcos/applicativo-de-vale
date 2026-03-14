import { PrismaService } from '../database/prisma.service';
export declare class DashboardService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalVales: any;
        totalClients: any;
        recentVales: any;
    }>;
}
