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
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const vales_service_1 = require("../vales/vales.service");
let DashboardService = DashboardService_1 = class DashboardService {
    prisma;
    valesService;
    logger = new common_1.Logger(DashboardService_1.name);
    constructor(prisma, valesService) {
        this.prisma = prisma;
        this.valesService = valesService;
    }
    async getStats() {
        try {
            const [totalVales, totalClients, recentValesRaw] = await Promise.all([
                this.prisma.vale.count(),
                this.prisma.client.count(),
                this.prisma.vale.findMany({
                    take: 5,
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
            ]);
            const recentVales = await Promise.all(recentValesRaw.map((vale) => this.valesService.formatValeResponse(vale)));
            return {
                totalVales,
                totalClients,
                recentVales,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching dashboard stats: ${error.message}`);
            throw error;
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vales_service_1.ValesService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map