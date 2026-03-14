import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ValesService } from './vales.service';
import { EmpresaService } from '../empresa/empresa.service';
import PDFDocument from 'pdfkit';
import * as s3 from '../lib/s3';
import fetch from 'node-fetch';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(
    private prisma: PrismaService,
    private valesService: ValesService,
    private empresaService: EmpresaService,
  ) {}

  async generatePdf(userId: string, valeIds: string[]) {
    try {
      // Get user's empresa
      const empresa = await this.empresaService.getByUserId(userId);
      if (!empresa) {
        throw new BadRequestException('User does not have an empresa profile');
      }

      // Get vales
      const vales = await this.valesService.getValesByIds(valeIds);

      if (vales.length === 0) {
        throw new BadRequestException('No vales found');
      }

      // Generate PDF
      const pdfBuffer = await this.createPdfBuffer(empresa, vales);

      // Upload PDF to S3
      const fileName = `vales-${Date.now()}.pdf`;
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

      // Save file record
      await this.prisma.file.create({
        data: {
          userId,
          fileName,
          cloud_storage_path,
          isPublic: true,
          contentType: 'application/pdf',
        },
      });

      const pdfUrl = await s3.getFileUrl(cloud_storage_path, true);

      this.logger.log(`PDF generated for ${valeIds.length} vales`);

      return { pdfUrl };
    } catch (error) {
      this.logger.error(`Error generating PDF: ${error.message}`);
      throw error;
    }
  }

  private async createPdfBuffer(
    empresa: any,
    vales: any[],
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Add header with empresa info
        doc
          .fontSize(20)
          .fillColor(empresa.primaryColor || '#000000')
          .text(empresa.name, { align: 'center' });

        doc
          .fontSize(10)
          .fillColor('#000000')
          .text(`CNPJ: ${empresa.cnpj}`, { align: 'center' })
          .text(`Endereço: ${empresa.address}`, { align: 'center' })
          .text(`Telefone: ${empresa.phone}`, { align: 'center' })
          .moveDown(2);

        // Add vales
        vales.forEach((vale, index) => {
          if (index > 0) {
            doc.addPage();
          }

          doc
            .fontSize(16)
            .fillColor(empresa.secondaryColor || '#000000')
            .text(
              vale.type === 'VIAGEM'
                ? 'VALE DE VIAGEM'
                : 'VALE DE DIÁRIA',
              { align: 'center' },
            )
            .moveDown();

          doc.fontSize(12).fillColor('#000000');

          // Common fields
          doc.text(`Cliente: ${vale.client.name}`);
          doc.text(`CNPJ Cliente: ${vale.client.cnpj}`);
          doc.text(`Local de Trabalho: ${vale.workLocation}`);
          doc.text(
            `Data: ${new Date(vale.date).toLocaleDateString('pt-BR')}`,
          );
          doc.moveDown();

          // Type-specific fields
          if (vale.type === 'VIAGEM') {
            doc.text(`Placa do Caminhão: ${vale.truckPlate}`);
            doc.text(`Nome do Motorista: ${vale.driverName}`);
            doc.text(`Tipo de Viagem: ${vale.tripType}`);
          } else {
            doc.text(`Nome do Operador: ${vale.operatorName}`);
            doc.text(`Equipamento: ${vale.equipment}`);
            doc.text(`Horário Manhã: ${vale.morningStart} - ${vale.morningEnd}`);
            doc.text(
              `Horário Tarde: ${vale.afternoonStart} - ${vale.afternoonEnd}`,
            );
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
}
