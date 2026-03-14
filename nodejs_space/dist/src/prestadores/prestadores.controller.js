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
exports.PrestadoresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prestadores_service_1 = require("./prestadores.service");
const prestador_dto_1 = require("./dto/prestador.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let PrestadoresController = class PrestadoresController {
    prestadoresService;
    constructor(prestadoresService) {
        this.prestadoresService = prestadoresService;
    }
    async create(user, createPrestadorDto) {
        return this.prestadoresService.create(user.userId, createPrestadorDto);
    }
    async findAll(search, page, limit) {
        return this.prestadoresService.findAll(search, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
    }
    async findOne(id) {
        return this.prestadoresService.findOne(id);
    }
    async update(id, updatePrestadorDto) {
        return this.prestadoresService.update(id, updatePrestadorDto);
    }
    async delete(id) {
        return this.prestadoresService.delete(id);
    }
};
exports.PrestadoresController = PrestadoresController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new prestador' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prestador created' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, prestador_dto_1.CreatePrestadorDto]),
    __metadata("design:returntype", Promise)
], PrestadoresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all prestadores' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prestadores retrieved' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PrestadoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prestador by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prestador retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prestador not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrestadoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update prestador' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prestador updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, prestador_dto_1.UpdatePrestadorDto]),
    __metadata("design:returntype", Promise)
], PrestadoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete prestador' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prestador deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrestadoresController.prototype, "delete", null);
exports.PrestadoresController = PrestadoresController = __decorate([
    (0, swagger_1.ApiTags)('Prestadores (Service Providers)'),
    (0, common_1.Controller)('api/prestadores'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [prestadores_service_1.PrestadoresService])
], PrestadoresController);
//# sourceMappingURL=prestadores.controller.js.map