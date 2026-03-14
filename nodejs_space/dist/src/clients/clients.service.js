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
var ClientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ClientsService = ClientsService_1 = class ClientsService {
    prisma;
    logger = new common_1.Logger(ClientsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createClientDto) {
        try {
            const client = await this.prisma.client.create({
                data: {
                    ...createClientDto,
                    createdById: userId,
                },
            });
            this.logger.log(`Client created: ${client.id}`);
            return client;
        }
        catch (error) {
            this.logger.error(`Error creating client: ${error.message}`);
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
                        { cnpj: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {};
            const [items, total] = await Promise.all([
                this.prisma.client.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                this.prisma.client.count({ where }),
            ]);
            return {
                items,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            this.logger.error(`Error fetching clients: ${error.message}`);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const client = await this.prisma.client.findUnique({
                where: { id },
            });
            if (!client) {
                throw new common_1.NotFoundException('Client not found');
            }
            return client;
        }
        catch (error) {
            this.logger.error(`Error fetching client: ${error.message}`);
            throw error;
        }
    }
    async update(id, updateClientDto) {
        try {
            const client = await this.prisma.client.update({
                where: { id },
                data: updateClientDto,
            });
            this.logger.log(`Client updated: ${id}`);
            return client;
        }
        catch (error) {
            this.logger.error(`Error updating client: ${error.message}`);
            throw error;
        }
    }
    async delete(id) {
        try {
            await this.prisma.client.delete({ where: { id } });
            this.logger.log(`Client deleted: ${id}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Error deleting client: ${error.message}`);
            throw error;
        }
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = ClientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map