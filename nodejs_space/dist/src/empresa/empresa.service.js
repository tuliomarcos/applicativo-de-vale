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
var EmpresaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const s3 = __importStar(require("../lib/s3"));
let EmpresaService = EmpresaService_1 = class EmpresaService {
    prisma;
    logger = new common_1.Logger(EmpresaService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createEmpresaDto) {
        try {
            const empresa = await this.prisma.empresa.create({
                data: {
                    ...createEmpresaDto,
                    userId,
                },
            });
            this.logger.log(`Empresa created: ${empresa.id}`);
            return await this.getEmpresaWithLogo(empresa.id);
        }
        catch (error) {
            this.logger.error(`Error creating empresa: ${error.message}`);
            throw error;
        }
    }
    async getByUserId(userId) {
        try {
            const empresa = await this.prisma.empresa.findUnique({
                where: { userId },
            });
            if (!empresa) {
                return null;
            }
            return await this.getEmpresaWithLogo(empresa.id);
        }
        catch (error) {
            this.logger.error(`Error fetching empresa: ${error.message}`);
            throw error;
        }
    }
    async update(id, updateEmpresaDto) {
        try {
            const empresa = await this.prisma.empresa.update({
                where: { id },
                data: updateEmpresaDto,
            });
            this.logger.log(`Empresa updated: ${id}`);
            return await this.getEmpresaWithLogo(empresa.id);
        }
        catch (error) {
            this.logger.error(`Error updating empresa: ${error.message}`);
            throw error;
        }
    }
    async getEmpresaWithLogo(empresaId) {
        const empresa = await this.prisma.empresa.findUnique({
            where: { id: empresaId },
            include: { logoFile: true },
        });
        if (!empresa) {
            throw new common_1.NotFoundException('Empresa not found');
        }
        let logoUrl = null;
        if (empresa.logoFile) {
            logoUrl = await s3.getFileUrl(empresa.logoFile.cloud_storage_path, empresa.logoFile.isPublic);
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
};
exports.EmpresaService = EmpresaService;
exports.EmpresaService = EmpresaService = EmpresaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmpresaService);
//# sourceMappingURL=empresa.service.js.map