import { PrismaService } from '../database/prisma.service';
import { DashboardStatsResponse } from '../types/api';
import { ValesService } from '../vales/vales.service';
export declare class DashboardService {
    private prisma;
    private valesService;
    private readonly logger;
    constructor(prisma: PrismaService, valesService: ValesService);
    getStats(): Promise<DashboardStatsResponse>;
}
