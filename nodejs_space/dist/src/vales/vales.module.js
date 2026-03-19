"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValesModule = void 0;
const common_1 = require("@nestjs/common");
const vales_controller_1 = require("./vales.controller");
const vales_service_1 = require("./vales.service");
const pdf_service_1 = require("./pdf.service");
const email_service_1 = require("./email.service");
const empresa_module_1 = require("../empresa/empresa.module");
let ValesModule = class ValesModule {
};
exports.ValesModule = ValesModule;
exports.ValesModule = ValesModule = __decorate([
    (0, common_1.Module)({
        imports: [empresa_module_1.EmpresaModule],
        controllers: [vales_controller_1.ValesController],
        providers: [vales_service_1.ValesService, pdf_service_1.PdfService, email_service_1.EmailService],
        exports: [vales_service_1.ValesService],
    })
], ValesModule);
//# sourceMappingURL=vales.module.js.map