import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DashboardStatsResponse } from '../types/api';
import { ValesService } from '../vales/vales.service';
import type { ValeWithClientSummary } from '../vales/vales.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private prisma: PrismaService,
    private valesService: ValesService,
  ) {}

  async getStats(): Promise<DashboardStatsResponse> {
    try {
      const [totalVales, totalClients, recentValesRaw] = await Promise.all([
        this.prisma.vale.count(),
        this.prisma.client.count(),
        this.prisma.vale.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            client: {
              select: {
                id: true,
                name: true,
                cnpj: true,
                email: true,
              },
            },
          },
        }),
      ]);

      const recentVales = await Promise.all(
        (recentValesRaw as ValeWithClientSummary[]).map((vale) =>
          this.valesService.formatValeResponse(vale),
        ),
      );

      return {
        totalVales,
        totalClients,
        recentVales,
      };
    } catch (error) {
      this.logger.error(`Error fetching dashboard stats: ${error.message}`);
      throw error;
    }
  }
}
