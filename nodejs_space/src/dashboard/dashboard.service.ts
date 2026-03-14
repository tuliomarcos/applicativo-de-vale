import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private prisma: PrismaService) {}

  async getStats() {
    try {
      const [totalVales, totalClients, recentVales] = await Promise.all([
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
