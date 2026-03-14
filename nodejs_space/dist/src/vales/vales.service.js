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
var ValesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const s3 = __importStar(require("../lib/s3"));
let ValesService = ValesService_1 = class ValesService {
    prisma;
    logger = new common_1.Logger(ValesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createValeViagem(userId, createDto) {
        try {
            const signaturePath = await this.uploadSignature(userId, createDto.signatureData);
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
        }
        catch (error) {
            this.logger.error(`Error creating Vale Viagem: ${error.message}`);
            throw error;
        }
    }
    async createValeDiaria(userId, createDto) {
        try {
            const signaturePath = await this.uploadSignature(userId, createDto.signatureData);
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
        }
        catch (error) {
            this.logger.error(`Error creating Vale Diária: ${error.message}`);
            throw error;
        }
    }
    async findAll(type, search, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const where = {};
            if (type && (type === 'VIAGEM' || type === 'DIARIA')) {
                where.type = type;
            }
            if (search) {
                where.OR = [
                    { workLocation: { contains: search, mode: 'insensitive' } },
                    { driverName: { contains: search, mode: 'insensitive' } },
                    { operatorName: { contains: search, mode: 'insensitive' } },
                    { client: { name: { contains: search, mode: 'insensitive' } } },
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
            const formattedItems = await Promise.all(items.map((item) => this.formatValeResponse(item)));
            return {
                items: formattedItems,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            this.logger.error(`Error fetching vales: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
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
                throw new common_1.NotFoundException('Vale not found');
            }
            return await this.formatValeResponse(vale);
        }
        catch (error) {
            this.logger.error(`Error fetching vale: ${error.message}`);
            throw error;
        }
    }
    async update(id, userId, userRole, updateDto) {
        try {
            if (userRole !== 'EMPRESA') {
                throw new common_1.ForbiddenException('Only EMPRESA users can update vales');
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
        }
        catch (error) {
            this.logger.error(`Error updating vale: ${error.message}`);
            throw error;
        }
    }
    async delete(id, userRole) {
        try {
            if (userRole !== 'EMPRESA') {
                throw new common_1.ForbiddenException('Only EMPRESA users can delete vales');
            }
            await this.prisma.vale.delete({ where: { id } });
            this.logger.log(`Vale deleted: ${id}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Error deleting vale: ${error.message}`);
            throw error;
        }
    }
    async uploadSignature(userId, signatureBase64) {
        try {
            const fileName = `signature-${Date.now()}.png`;
            const { uploadUrl, cloud_storage_path } = await s3.generatePresignedUploadUrl(fileName, 'image/png', false);
            const base64Data = signatureBase64.replace(/^data:image\/png;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const fetch = (await import('node-fetch')).default;
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                body: buffer,
                headers: {
                    'Content-Type': 'image/png',
                },
            });
            if (!uploadResponse.ok) {
                throw new common_1.BadRequestException('Failed to upload signature');
            }
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
        }
        catch (error) {
            this.logger.error(`Error uploading signature: ${error.message}`);
            throw error;
        }
    }
    async formatValeResponse(vale) {
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
            truckPlate: vale.truckPlate,
            driverName: vale.driverName,
            tripType: vale.tripType,
            operatorName: vale.operatorName,
            morningStart: vale.morningStart,
            morningEnd: vale.morningEnd,
            afternoonStart: vale.afternoonStart,
            afternoonEnd: vale.afternoonEnd,
            totalHours: vale.totalHours,
            equipment: vale.equipment,
        };
    }
    async getValesByIds(valeIds) {
        const vales = await this.prisma.vale.findMany({
            where: { id: { in: valeIds } },
            include: {
                client: true,
            },
        });
        return await Promise.all(vales.map((vale) => this.formatValeResponse(vale)));
    }
};
exports.ValesService = ValesService;
exports.ValesService = ValesService = ValesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ValesService);
//# sourceMappingURL=vales.service.js.map