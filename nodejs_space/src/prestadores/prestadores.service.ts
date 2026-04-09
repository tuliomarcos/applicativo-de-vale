import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreatePrestadorDto,
  UpdatePrestadorDto,
} from './dto/prestador.dto';
import { PaginatedResponse, PrestadorResponse, SuccessResponse } from '../types/api';

@Injectable()
export class PrestadoresService {
  private readonly logger = new Logger(PrestadoresService.name);

  private toResponse(prestador: {
    id: string;
    createdById: string;
    name: string;
    document: string;
    vehiclePlate: string;
    documentType: 'CPF' | 'CNPJ';
    address: string;
    phone: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): PrestadorResponse {
    return {
      id: prestador.id,
      createdById: prestador.createdById,
      name: prestador.name,
      cpf: prestador.document,
      vehiclePlate: prestador.vehiclePlate,
      documentType: prestador.documentType,
      address: prestador.address,
      phone: prestador.phone,
      email: prestador.email,
      createdAt: prestador.createdAt,
      updatedAt: prestador.updatedAt,
    };
  }

  constructor(private prisma: PrismaService) {}

  private async syncPrestadoresFromSignupUsers(): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: { role: 'PRESTADOR' },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
    });

    for (const user of users) {
      const existing = await this.prisma.prestador.findFirst({
        where: {
          OR: [
            { email: user.email },
            {
              AND: [
                { name: user.name },
                { phone: user.phone },
              ],
            },
          ],
        },
      });

      if (!existing) {
        await this.prisma.prestador.create({
          data: {
            createdById: user.id,
            name: user.name,
            document: '',
            vehiclePlate: '',
            documentType: 'CPF',
            address: '',
            phone: user.phone,
            email: user.email,
          },
        });
      }
    }
  }

  async create(
    userId: string,
    createPrestadorDto: CreatePrestadorDto,
  ): Promise<PrestadorResponse> {
    try {
      const prestador = await this.prisma.prestador.create({
        data: {
          name: createPrestadorDto.name,
          document: createPrestadorDto.cpf ?? '',
          vehiclePlate: createPrestadorDto.vehiclePlate,
          documentType: 'CPF',
          address: createPrestadorDto.address ?? '',
          phone: createPrestadorDto.phone,
          email: createPrestadorDto.email ?? '',
          createdById: userId,
        },
      });

      this.logger.log(`Prestador created: ${prestador.id}`);
      return this.toResponse(prestador);
    } catch (error) {
      this.logger.error(`Error creating prestador: ${error.message}`);
      throw error;
    }
  }

  async findAll(
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<PrestadorResponse>> {
    try {
      await this.syncPrestadoresFromSignupUsers();

      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { document: { contains: search, mode: 'insensitive' as const } },
              { vehiclePlate: { contains: search, mode: 'insensitive' as const } },
              { phone: { contains: search, mode: 'insensitive' as const } },
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
        items: items.map((item) => this.toResponse(item)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error fetching prestadores: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<PrestadorResponse> {
    try {
      const prestador = await this.prisma.prestador.findUnique({
        where: { id },
      });

      if (!prestador) {
        throw new NotFoundException('Prestador not found');
      }

      return this.toResponse(prestador);
    } catch (error) {
      this.logger.error(`Error fetching prestador: ${error.message}`);
      throw error;
    }
  }

  async update(
    id: string,
    updatePrestadorDto: UpdatePrestadorDto,
  ): Promise<PrestadorResponse> {
    try {
      const existing = await this.prisma.prestador.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Prestador not found');
      }

      const prestador = await this.prisma.prestador.update({
        where: { id },
        data: {
          name: updatePrestadorDto.name,
          document: updatePrestadorDto.cpf,
          vehiclePlate: updatePrestadorDto.vehiclePlate,
          address: updatePrestadorDto.address,
          phone: updatePrestadorDto.phone,
          email: updatePrestadorDto.email,
        },
      });

      this.logger.log(`Prestador updated: ${id}`);
      return this.toResponse(prestador);
    } catch (error) {
      this.logger.error(`Error updating prestador: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string): Promise<SuccessResponse> {
    try {
      const existing = await this.prisma.prestador.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Prestador not found');
      }

      await this.prisma.prestador.delete({ where: { id } });
      this.logger.log(`Prestador deleted: ${id}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error deleting prestador: ${error.message}`);
      throw error;
    }
  }
}
