import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
import * as s3 from '../lib/s3';
import { EmpresaResponse } from '../types/api';

@Injectable()
export class EmpresaService {
  private readonly logger = new Logger(EmpresaService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createEmpresaDto: CreateEmpresaDto,
  ): Promise<EmpresaResponse> {
    try {
      const empresa = await this.prisma.empresa.create({
        data: {
          ...createEmpresaDto,
          userId,
        },
      });

      this.logger.log(`Empresa created: ${empresa.id}`);
      return await this.getEmpresaWithLogo(empresa.id);
    } catch (error) {
      this.logger.error(`Error creating empresa: ${error.message}`);
      throw error;
    }
  }

  async getByUserId(userId: string): Promise<EmpresaResponse | null> {
    try {
      const empresa = await this.prisma.empresa.findUnique({
        where: { userId },
      });

      if (!empresa) {
        return null;
      }

      return await this.getEmpresaWithLogo(empresa.id);
    } catch (error) {
      this.logger.error(`Error fetching empresa: ${error.message}`);
      throw error;
    }
  }

  async update(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<EmpresaResponse> {
    try {
      const empresa = await this.prisma.empresa.update({
        where: { id },
        data: updateEmpresaDto,
      });

      this.logger.log(`Empresa updated: ${id}`);
      return await this.getEmpresaWithLogo(empresa.id);
    } catch (error) {
      this.logger.error(`Error updating empresa: ${error.message}`);
      throw error;
    }
  }

  private async getEmpresaWithLogo(
    empresaId: string,
  ): Promise<EmpresaResponse> {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      include: { logoFile: true },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa not found');
    }

    let logoUrl = null;
    if (empresa.logoFile) {
      logoUrl = await s3.getFileUrl(
        empresa.logoFile.cloud_storage_path,
        empresa.logoFile.isPublic,
      );
    }

    return {
      id: empresa.id,
      name: empresa.name,
      cnpj: empresa.cnpj,
      address: empresa.address,
      phone: empresa.phone,
      primaryColor: empresa.primaryColor,
      secondaryColor: empresa.secondaryColor,
      logoUrl,
      userId: empresa.userId,
      createdAt: empresa.createdAt,
    };
  }
}
