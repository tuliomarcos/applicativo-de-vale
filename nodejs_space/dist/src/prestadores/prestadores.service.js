"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrestadoresService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrestadoresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let PrestadoresService = PrestadoresService_1 = class PrestadoresService {
    prisma;
    logger = new common_1.Logger(PrestadoresService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createPrestadorDto) {
        try {
            const prestador = await this.prisma.prestador.create({
                data: {
                    ...createPrestadorDto,
                    createdById: userId,
                },
            });
            this.logger.log(`Prestador created: ${prestador.id}`);
            return prestador;
        }
        catch (error) {
            this.logger.error(`Error creating prestador: ${error.message}`);
            throw error;
        }
    }
    async findAll(search, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const where = search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { document: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
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
        }
        catch (error) {
            this.logger.error(`Error fetching prestadores: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const prestador = await this.prisma.prestador.findUnique({
                where: { id },
            });
            if (!prestador) {
                throw new common_1.NotFoundException('Prestador not found');
            }
            return prestador;
        }
        catch (error) {
            this.logger.error(`Error fetching prestador: ${error.message}`);
            throw error;
        }
    }
    async update(id, updatePrestadorDto) {
        try {
            const prestador = await this.prisma.prestador.update({
                where: { id },
                data: updatePrestadorDto,
            });
            this.logger.log(`Prestador updated: ${id}`);
            return prestador;
        }
        catch (error) {
            this.logger.error(`Error updating prestador: ${error.message}`);
            throw error;
        }
    }
    async delete(id) {
        try {
            await this.prisma.prestador.delete({ where: { id } });
            this.logger.log(`Prestador deleted: ${id}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Error deleting prestador: ${error.message}`);
            throw error;
        }
    }
};
exports.PrestadoresService = PrestadoresService;
exports.PrestadoresService = PrestadoresService = PrestadoresService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrestadoresService);
//# sourceMappingURL=prestadores.service.js.map