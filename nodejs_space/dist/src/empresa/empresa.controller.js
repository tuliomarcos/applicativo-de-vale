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
exports.EmpresaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const empresa_service_1 = require("./empresa.service");
const empresa_dto_1 = require("./dto/empresa.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let EmpresaController = class EmpresaController {
    empresaService;
    constructor(empresaService) {
        this.empresaService = empresaService;
    }
    async create(user, createEmpresaDto) {
        return this.empresaService.create(user.userId, createEmpresaDto);
    }
    async getEmpresa(user) {
        return this.empresaService.getByUserId(user.userId);
    }
    async update(id, updateEmpresaDto) {
        return this.empresaService.update(id, updateEmpresaDto);
    }
};
exports.EmpresaController = EmpresaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create empresa profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Empresa created' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, empresa_dto_1.CreateEmpresaDto]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user empresa profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Empresa retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getEmpresa", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update empresa profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Empresa updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, empresa_dto_1.UpdateEmpresaDto]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "update", null);
exports.EmpresaController = EmpresaController = __decorate([
    (0, swagger_1.ApiTags)('Empresa (Earthmoving Company)'),
    (0, common_1.Controller)('api/empresa'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService])
], EmpresaController);
//# sourceMappingURL=empresa.controller.js.map