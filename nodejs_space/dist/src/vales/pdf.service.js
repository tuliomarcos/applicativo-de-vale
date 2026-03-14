"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const vales_service_1 = require("./vales.service");
const empresa_service_1 = require("../empresa/empresa.service");
const pdfkit_1 = __importDefault(require("pdfkit"));
const s3 = __importStar(require("../lib/s3"));
const node_fetch_1 = __importDefault(require("node-fetch"));
let PdfService = PdfService_1 = class PdfService {
    prisma;
    valesService;
    empresaService;
    logger = new common_1.Logger(PdfService_1.name);
    constructor(prisma, valesService, empresaService) {
        this.prisma = prisma;
        this.valesService = valesService;
        this.empresaService = empresaService;
    }
    async generatePdf(userId, valeIds) {
        try {
            const empresa = await this.empresaService.getByUserId(userId);
            if (!empresa) {
                throw new common_1.BadRequestException('User does not have an empresa profile');
            }
            const vales = await this.valesService.getValesByIds(valeIds);
            if (vales.length === 0) {
                throw new common_1.BadRequestException('No vales found');
            }
            const pdfBuffer = await this.createPdfBuffer(empresa, vales);
            const fileName = `vales-${Date.now()}.pdf`;
            const { uploadUrl, cloud_storage_path } = await s3.generatePresignedUploadUrl(fileName, 'application/pdf', true);
            const uploadResponse = await (0, node_fetch_1.default)(uploadUrl, {
                method: 'PUT',
                body: pdfBuffer,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment',
                },
            });
            if (!uploadResponse.ok) {
                throw new common_1.BadRequestException('Failed to upload PDF');
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
            const pdfUrl = await s3.getFileUrl(cloud_storage_path, true);
            this.logger.log(`PDF generated for ${valeIds.length} vales`);
            return { pdfUrl };
        }
        catch (error) {
            this.logger.error(`Error generating PDF: ${error.message}`);
            throw error;
        }
    }
    async createPdfBuffer(empresa, vales) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);
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
                vales.forEach((vale, index) => {
                    if (index > 0) {
                        doc.addPage();
                    }
                    doc
                        .fontSize(16)
                        .fillColor(empresa.secondaryColor || '#000000')
                        .text(vale.type === 'VIAGEM'
                        ? 'VALE DE VIAGEM'
                        : 'VALE DE DIÁRIA', { align: 'center' })
                        .moveDown();
                    doc.fontSize(12).fillColor('#000000');
                    doc.text(`Cliente: ${vale.client.name}`);
                    doc.text(`CNPJ Cliente: ${vale.client.cnpj}`);
                    doc.text(`Local de Trabalho: ${vale.workLocation}`);
                    doc.text(`Data: ${new Date(vale.date).toLocaleDateString('pt-BR')}`);
                    doc.moveDown();
                    if (vale.type === 'VIAGEM') {
                        doc.text(`Placa do Caminhão: ${vale.truckPlate}`);
                        doc.text(`Nome do Motorista: ${vale.driverName}`);
                        doc.text(`Tipo de Viagem: ${vale.tripType}`);
                    }
                    else {
                        doc.text(`Nome do Operador: ${vale.operatorName}`);
                        doc.text(`Equipamento: ${vale.equipment}`);
                        doc.text(`Horário Manhã: ${vale.morningStart} - ${vale.morningEnd}`);
                        doc.text(`Horário Tarde: ${vale.afternoonStart} - ${vale.afternoonEnd}`);
                        doc.text(`Total de Horas: ${vale.totalHours}h`);
                    }
                    doc.moveDown();
                    doc.text('Assinatura:', { continued: false });
                    doc.text('_________________________________');
                });
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = PdfService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vales_service_1.ValesService,
        empresa_service_1.EmpresaService])
], PdfService);
//# sourceMappingURL=pdf.service.js.map