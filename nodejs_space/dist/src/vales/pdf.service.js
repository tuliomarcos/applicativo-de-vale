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
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
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
            const profile = await this.resolvePdfHeaderProfile(userId);
            const vales = await this.valesService.getValesByIds(valeIds);
            if (vales.length === 0) {
                throw new common_1.BadRequestException('No vales found');
            }
            const pdfBuffer = await this.createPdfBuffer(profile, vales);
            const fileName = `vales-${Date.now()}.pdf`;
            const pdfUrl = await this.uploadPdfAndGetUrl(userId, fileName, pdfBuffer);
            this.logger.log(`PDF generated for ${valeIds.length} vales`);
            return { pdfUrl };
        }
        catch (error) {
            this.logger.error(`Error generating PDF: ${error.message}`);
            throw error;
        }
    }
    async createPdfBuffer(profile, vales) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);
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
                vales.forEach((vale, index) => {
                    if (index > 0) {
                        doc.addPage();
                    }
                    doc
                        .fontSize(16)
                        .fillColor(profile.secondaryColor || '#000000')
                        .text(vale.type === 'VIAGEM' ? 'VALE DE VIAGEM' : 'VALE DE DIARIA', { align: 'center' })
                        .moveDown();
                    doc.fontSize(12).fillColor('#000000');
                    doc.text(`Cliente: ${vale.client.name}`);
                    doc.text(`CNPJ Cliente: ${vale.client.cnpj}`);
                    doc.text(`Local de Trabalho: ${vale.workLocation}`);
                    doc.text(`Data: ${new Date(vale.date).toLocaleDateString('pt-BR')}`);
                    doc.moveDown();
                    if (vale.type === 'VIAGEM') {
                        doc.text(`Placa do Caminhao: ${vale.truckPlate}`);
                        doc.text(`Nome do Motorista: ${vale.driverName}`);
                        doc.text(`Tipo de Viagem: ${vale.tripType}`);
                    }
                    else {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async resolvePdfHeaderProfile(userId) {
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
            throw new common_1.BadRequestException('User not found');
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
    async uploadPdfAndGetUrl(userId, fileName, pdfBuffer) {
        try {
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
            return await s3.getFileUrl(cloud_storage_path, true);
        }
        catch (error) {
            const localDir = (0, node_path_1.join)(process.cwd(), 'uploads', 'pdfs');
            await (0, promises_1.mkdir)(localDir, { recursive: true });
            const localPath = (0, node_path_1.join)(localDir, fileName);
            await (0, promises_1.writeFile)(localPath, pdfBuffer);
            this.logger.warn(`S3 upload failed, using local PDF fallback: ${error.message}`);
            const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:2026';
            return `${appBaseUrl}/api/vales/local-pdf/${fileName}`;
        }
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