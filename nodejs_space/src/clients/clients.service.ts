import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createClientDto: CreateClientDto) {
    try {
      const client = await this.prisma.client.create({
        data: {
          ...createClientDto,
          createdById: userId,
        },
      });

      this.logger.log(`Client created: ${client.id}`);
      return client;
    } catch (error) {
      this.logger.error(`Error creating client: ${error.message}`);
      throw error;
    }
  }

  async findAll(search?: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { cnpj: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [items, total] = await Promise.all([
        this.prisma.client.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.client.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error fetching clients: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      return client;
    } catch (error) {
      this.logger.error(`Error fetching client: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.prisma.client.update({
        where: { id },
        data: updateClientDto,
      });

      this.logger.log(`Client updated: ${id}`);
      return client;
    } catch (error) {
      this.logger.error(`Error updating client: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.client.delete({ where: { id } });
      this.logger.log(`Client deleted: ${id}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error deleting client: ${error.message}`);
      throw error;
    }
  }
}
