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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vales_service_1 = require("./vales.service");
const pdf_service_1 = require("./pdf.service");
const email_service_1 = require("./email.service");
const vale_dto_1 = require("./dto/vale.dto");
const vale_actions_dto_1 = require("./dto/vale-actions.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ValesController = class ValesController {
    valesService;
    pdfService;
    emailService;
    constructor(valesService, pdfService, emailService) {
        this.valesService = valesService;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }
    async createValeViagem(user, createDto) {
        return this.valesService.createValeViagem(user.userId, createDto);
    }
    async createValeDiaria(user, createDto) {
        return this.valesService.createValeDiaria(user.userId, createDto);
    }
    async findAll(type, search, page, limit) {
        return this.valesService.findAll(type, search, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
    }
    async findOne(id) {
        return this.valesService.findOne(id);
    }
    async update(id, user, updateDto) {
        return this.valesService.update(id, user.userId, user.role, updateDto);
    }
    async delete(id, user) {
        return this.valesService.delete(id, user.role);
    }
    async generatePdf(user, dto) {
        return this.pdfService.generatePdf(user.userId, dto.valeIds);
    }
    async sendEmail(user, dto) {
        return this.emailService.sendValesEmail(user.userId, dto.valeIds, dto.recipientEmail);
    }
    async generateShareLink(user, dto) {
        const pdfResult = await this.pdfService.generatePdf(user.userId, dto.valeIds);
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Confira os vales: ${pdfResult.pdfUrl}`)}`;
        return {
            pdfUrl: pdfResult.pdfUrl,
            whatsappUrl,
        };
    }
};
exports.ValesController = ValesController;
__decorate([
    (0, common_1.Post)('viagem'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Vale Viagem' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vale Viagem created' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vale_dto_1.CreateValeViagemDto]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "createValeViagem", null);
__decorate([
    (0, common_1.Post)('diaria'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Vale Diária' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vale Diária created' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vale_dto_1.CreateValeDiariaDto]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "createValeDiaria", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vales' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['VIAGEM', 'DIARIA'] }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vales retrieved' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vale by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vale retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vale not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vale (EMPRESA only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vale updated' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, vale_dto_1.UpdateValeDto]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete vale (EMPRESA only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vale deleted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate PDF for vales' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'PDF generated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vale_actions_dto_1.GeneratePdfDto]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "generatePdf", null);
__decorate([
    (0, common_1.Post)('send-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Send vales via email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email sent' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vale_actions_dto_1.SendEmailDto]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)('share-link'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate WhatsApp share link' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Share link generated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vale_actions_dto_1.ShareLinkDto]),
    __metadata("design:returntype", Promise)
], ValesController.prototype, "generateShareLink", null);
exports.ValesController = ValesController = __decorate([
    (0, swagger_1.ApiTags)('Vales (Vouchers)'),
    (0, common_1.Controller)('api/vales'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [vales_service_1.ValesService,
        pdf_service_1.PdfService,
        email_service_1.EmailService])
], ValesController);
//# sourceMappingURL=vales.controller.js.map