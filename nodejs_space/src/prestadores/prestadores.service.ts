import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreatePrestadorDto,
  UpdatePrestadorDto,
} from './dto/prestador.dto';

@Injectable()
export class PrestadoresService {
  private readonly logger = new Logger(PrestadoresService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPrestadorDto: CreatePrestadorDto) {
    try {
      const prestador = await this.prisma.prestador.create({
        data: {
          ...createPrestadorDto,
          createdById: userId,
        },
      });

      this.logger.log(`Prestador created: ${prestador.id}`);
      return prestador;
    } catch (error) {
      this.logger.error(`Error creating prestador: ${error.message}`);
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
              { document: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [items, total] = await Promise.all([
        this.prisma.prestador.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.prestador.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error fetching prestadores: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const prestador = await this.prisma.prestador.findUnique({
        where: { id },
      });

      if (!prestador) {
        throw new NotFoundException('Prestador not found');
      }

      return prestador;
    } catch (error) {
      this.logger.error(`Error fetching prestador: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updatePrestadorDto: UpdatePrestadorDto) {
    try {
      const prestador = await this.prisma.prestador.update({
        where: { id },
        data: updatePrestadorDto,
      });

      this.logger.log(`Prestador updated: ${id}`);
      return prestador;
    } catch (error) {
      this.logger.error(`Error updating prestador: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.prestador.delete({ where: { id } });
      this.logger.log(`Prestador deleted: ${id}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error deleting prestador: ${error.message}`);
      throw error;
    }
  }
}
