import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateValeViagemDto,
  CreateValeDiariaDto,
  UpdateValeDto,
} from './dto/vale.dto';
import * as s3 from '../lib/s3';
import { Prisma } from '@prisma/client';
import {
  PaginatedResponse,
  ValeResponse,
  SuccessResponse,
  UserRoleValue,
} from '../types/api';

type ValeWithClientSummary = Prisma.ValeGetPayload<{
  include: {
    client: {
      select: {
        id: true;
        name: true;
        cnpj: true;
        email: true;
      };
    };
  };
}>;

type ValeWithClientDetail = Prisma.ValeGetPayload<{
  include: {
    client: {
      select: {
        id: true;
        name: true;
        cnpj: true;
        email: true;
        address: true;
        phone: true;
      };
    };
  };
}>;

@Injectable()
export class ValesService {
  private readonly logger = new Logger(ValesService.name);

  constructor(private prisma: PrismaService) {}

  async createValeViagem(
    userId: string,
    createDto: CreateValeViagemDto,
  ): Promise<ValeResponse> {
    try {
      // Upload signature to S3
      const signaturePath = await this.uploadSignature(
        userId,
        createDto.signatureData,
      );

      const vale = await this.prisma.vale.create({
        data: {
          type: 'VIAGEM',
          createdById: userId,
          clientId: createDto.clientId,
          workLocation: createDto.workLocation,
          date: new Date(createDto.date),
          signaturePath,
          truckPlate: createDto.truckPlate,
          driverName: createDto.driverName,
          tripType: createDto.tripType,
        },
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
      });

      this.logger.log(`Vale Viagem created: ${vale.id}`);
      return await this.formatValeResponse(vale);
    } catch (error) {
      this.logger.error(`Error creating Vale Viagem: ${error.message}`);
      throw error;
    }
  }

  async createValeDiaria(
    userId: string,
    createDto: CreateValeDiariaDto,
  ): Promise<ValeResponse> {
    try {
      // Upload signature to S3
      const signaturePath = await this.uploadSignature(
        userId,
        createDto.signatureData,
      );

      const vale = await this.prisma.vale.create({
        data: {
          type: 'DIARIA',
          createdById: userId,
          clientId: createDto.clientId,
          workLocation: createDto.workLocation,
          date: new Date(createDto.date),
          signaturePath,
          operatorName: createDto.operatorName,
          morningStart: createDto.morningStart,
          morningEnd: createDto.morningEnd,
          afternoonStart: createDto.afternoonStart,
          afternoonEnd: createDto.afternoonEnd,
          totalHours: createDto.totalHours,
          equipment: createDto.equipment,
        },
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
      });

      this.logger.log(`Vale Diária created: ${vale.id}`);
      return await this.formatValeResponse(vale);
    } catch (error) {
      this.logger.error(`Error creating Vale Diária: ${error.message}`);
      throw error;
    }
  }

  async findAll(
    type?: string,
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<ValeResponse>> {
    try {
      const skip = (page - 1) * limit;

      const where: Prisma.ValeWhereInput = {};

      if (type && (type === 'VIAGEM' || type === 'DIARIA')) {
        where.type = type;
      }

      if (search) {
        where.OR = [
          { workLocation: { contains: search, mode: 'insensitive' as const } },
          { driverName: { contains: search, mode: 'insensitive' as const } },
          { operatorName: { contains: search, mode: 'insensitive' as const } },
          { client: { name: { contains: search, mode: 'insensitive' as const } } },
        ];
      }

      const [items, total] = await Promise.all([
        this.prisma.vale.findMany({
          where,
          skip,
          take: limit,
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
        this.prisma.vale.count({ where }),
      ]);

      const formattedItems = await Promise.all(
        items.map((item) => this.formatValeResponse(item)),
      );

      return {
        items: formattedItems,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error fetching vales: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<ValeResponse> {
    try {
      const vale = await this.prisma.vale.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              cnpj: true,
              email: true,
              address: true,
              phone: true,
            },
          },
        },
      });

      if (!vale) {
        throw new NotFoundException('Vale not found');
      }

      return await this.formatValeResponse(vale);
    } catch (error) {
      this.logger.error(`Error fetching vale: ${error.message}`);
      throw error;
    }
  }

  async update(
    id: string,
    userId: string,
    userRole: UserRoleValue,
    updateDto: UpdateValeDto,
  ): Promise<ValeResponse> {
    try {
      // Only EMPRESA role can update vales
      if (userRole !== 'EMPRESA') {
        throw new ForbiddenException('Only EMPRESA users can update vales');
      }

      const vale = await this.prisma.vale.update({
        where: { id },
        data: updateDto,
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
      });

      this.logger.log(`Vale updated: ${id}`);
      return await this.formatValeResponse(vale);
    } catch (error) {
      this.logger.error(`Error updating vale: ${error.message}`);
      throw error;
    }
  }

  async delete(
    id: string,
    userRole: UserRoleValue,
  ): Promise<SuccessResponse> {
    try {
      // Only EMPRESA role can delete vales
      if (userRole !== 'EMPRESA') {
        throw new ForbiddenException('Only EMPRESA users can delete vales');
      }

      await this.prisma.vale.delete({ where: { id } });
      this.logger.log(`Vale deleted: ${id}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error deleting vale: ${error.message}`);
      throw error;
    }
  }

  private async uploadSignature(
    userId: string,
    signatureBase64: string,
  ): Promise<string> {
    try {
      // Decode base64 and upload to S3
      const fileName = `signature-${Date.now()}.png`;
      const { uploadUrl, cloud_storage_path } =
        await s3.generatePresignedUploadUrl(fileName, 'image/png', false);

      // Convert base64 to buffer
      const base64Data = signatureBase64.replace(
        /^data:image\/png;base64,/,
        '',
      );
      const buffer = Buffer.from(base64Data, 'base64');

      // Upload to S3 using the presigned URL
      const fetch = (await import('node-fetch')).default;
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: buffer,
        headers: {
          'Content-Type': 'image/png',
        },
      });

      if (!uploadResponse.ok) {
        throw new BadRequestException('Failed to upload signature');
      }

      // Save file record to database
      await this.prisma.file.create({
        data: {
          userId,
          fileName,
          cloud_storage_path,
          isPublic: false,
          contentType: 'image/png',
        },
      });

      return cloud_storage_path;
    } catch (error) {
      this.logger.error(`Error uploading signature: ${error.message}`);
      throw error;
    }
  }

  async formatValeResponse(
    vale: ValeWithClientSummary | ValeWithClientDetail,
  ): Promise<ValeResponse> {
    const signatureUrl = await s3.getFileUrl(vale.signaturePath, false);

    return {
      id: vale.id,
      type: vale.type,
      clientId: vale.clientId,
      client: vale.client,
      workLocation: vale.workLocation,
      date: vale.date,
      signatureUrl,
      createdById: vale.createdById,
      createdAt: vale.createdAt,
      // VIAGEM fields
      truckPlate: vale.truckPlate,
      driverName: vale.driverName,
      tripType: vale.tripType,
      // DIARIA fields
      operatorName: vale.operatorName,
      morningStart: vale.morningStart,
      morningEnd: vale.morningEnd,
      afternoonStart: vale.afternoonStart,
      afternoonEnd: vale.afternoonEnd,
      totalHours: vale.totalHours,
      equipment: vale.equipment,
    };
  }

  async getValesByIds(valeIds: string[]): Promise<ValeResponse[]> {
    const vales: ValeWithClientSummary[] = await this.prisma.vale.findMany({
      where: { id: { in: valeIds } },
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
    });

    return await Promise.all(
      vales.map((vale) => this.formatValeResponse(vale)),
    );
  }
}
