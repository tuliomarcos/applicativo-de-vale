import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ValesService } from './vales.service';
import { EmpresaService } from '../empresa/empresa.service';
import PDFDocument from 'pdfkit';
import * as s3 from '../lib/s3';
import fetch from 'node-fetch';
import { EmpresaResponse, PdfResponse, ValeResponse } from '../types/api';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

type PdfHeaderProfile = Pick<
  EmpresaResponse,
  'name' | 'cnpj' | 'address' | 'phone' | 'primaryColor' | 'secondaryColor'
>;

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(
    private prisma: PrismaService,
    private valesService: ValesService,
    private empresaService: EmpresaService,
  ) {}

  async generatePdf(userId: string, valeIds: string[]): Promise<PdfResponse> {
    try {
      const profile = await this.resolvePdfHeaderProfile(userId);

      // Get vales
      const vales = await this.valesService.getValesByIds(valeIds);

      if (vales.length === 0) {
        throw new BadRequestException('No vales found');
      }

      // Generate PDF
      const pdfBuffer = await this.createPdfBuffer(profile, vales);

      const fileName = `vales-${Date.now()}.pdf`;
      const pdfUrl = await this.uploadPdfAndGetUrl(userId, fileName, pdfBuffer);

      this.logger.log(`PDF generated for ${valeIds.length} vales`);

      return { pdfUrl };
    } catch (error) {
      this.logger.error(`Error generating PDF: ${error.message}`);
      throw error;
    }
  }

  private async createPdfBuffer(
    profile: PdfHeaderProfile,
    vales: ValeResponse[],
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Add header with profile info
        doc
          .fontSize(20)
          .fillColor(profile.primaryColor || '#000000')
          .text(profile.name, { align: 'center' });

        doc
          .fontSize(10)
          .fillColor('#000000')
          .text(`CNPJ/CPF: ${profile.cnpj || 'Nao informado'}`, {
            align: 'center',
          })
          .text(`Endereco: ${profile.address || 'Nao informado'}`, {
            align: 'center',
          })
          .text(`Telefone: ${profile.phone || 'Nao informado'}`, {
            align: 'center',
          })
          .moveDown(2);

        // Add vales
        vales.forEach((vale, index) => {
          if (index > 0) {
            doc.addPage();
          }

          doc
            .fontSize(16)
            .fillColor(profile.secondaryColor || '#000000')
            .text(
              vale.type === 'VIAGEM' ? 'VALE DE VIAGEM' : 'VALE DE DIARIA',
              { align: 'center' },
            )
            .moveDown();

          doc.fontSize(12).fillColor('#000000');

          // Common fields
          doc.text(`Cliente: ${vale.client.name}`);
          doc.text(`CNPJ Cliente: ${vale.client.cnpj}`);
          doc.text(`Local de Trabalho: ${vale.workLocation}`);
          doc.text(`Data: ${new Date(vale.date).toLocaleDateString('pt-BR')}`);
          doc.moveDown();

          // Type-specific fields
          if (vale.type === 'VIAGEM') {
            doc.text(`Placa do Caminhao: ${vale.truckPlate}`);
            doc.text(`Nome do Motorista: ${vale.driverName}`);
            doc.text(`Tipo de Viagem: ${vale.tripType}`);
          } else {
            doc.text(`Nome do Operador: ${vale.operatorName}`);
            doc.text(`Equipamento: ${vale.equipment}`);
            doc.text(`Horario Manha: ${vale.morningStart} - ${vale.morningEnd}`);
            doc.text(`Horario Tarde: ${vale.afternoonStart} - ${vale.afternoonEnd}`);
            doc.text(`Total de Horas: ${vale.totalHours}h`);
          }

          doc.moveDown();
          doc.text('Assinatura:', { continued: false });
          doc.text('_________________________________');
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private async resolvePdfHeaderProfile(
    userId: string,
  ): Promise<PdfHeaderProfile> {
    const empresa = await this.empresaService.getByUserId(userId);

    if (empresa) {
      return {
        name: empresa.name,
        cnpj: empresa.cnpj,
        address: empresa.address,
        phone: empresa.phone,
        primaryColor: empresa.primaryColor,
        secondaryColor: empresa.secondaryColor,
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, phone: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      name: user.name || 'Vale de Servico',
      cnpj: '',
      address: '',
      phone: user.phone || '',
      primaryColor: '#000000',
      secondaryColor: '#000000',
    };
  }

  private async uploadPdfAndGetUrl(
    userId: string,
    fileName: string,
    pdfBuffer: Buffer,
  ): Promise<string> {
    try {
      const { uploadUrl, cloud_storage_path } =
        await s3.generatePresignedUploadUrl(fileName, 'application/pdf', true);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: pdfBuffer,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment',
        },
      });

      if (!uploadResponse.ok) {
        throw new BadRequestException('Failed to upload PDF');
      }

      await this.prisma.file.create({
        data: {
          userId,
          fileName,
          cloud_storage_path,
          isPublic: true,
          contentType: 'application/pdf',
        },
      });

      return await s3.getFileUrl(cloud_storage_path, true);
    } catch (error) {
      const localDir = join(process.cwd(), 'uploads', 'pdfs');
      await mkdir(localDir, { recursive: true });

      const localPath = join(localDir, fileName);
      await writeFile(localPath, pdfBuffer);

      this.logger.warn(
        `S3 upload failed, using local PDF fallback: ${error.message}`,
      );

      const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:2026';
      return `${appBaseUrl}/api/vales/local-pdf/${fileName}`;
    }
  }
}
