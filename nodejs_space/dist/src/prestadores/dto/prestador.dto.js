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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrestadorDto = exports.CreatePrestadorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DocumentType;
(function (DocumentType) {
    DocumentType["CPF"] = "CPF";
    DocumentType["CNPJ"] = "CNPJ";
})(DocumentType || (DocumentType = {}));
class CreatePrestadorDto {
    name;
    document;
    documentType;
    address;
    phone;
    email;
}
exports.CreatePrestadorDto = CreatePrestadorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Service Provider Inc' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrestadorDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123.456.789-00' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrestadorDto.prototype, "document", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DocumentType, example: 'CPF' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(DocumentType),
    __metadata("design:type", String)
], CreatePrestadorDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rua Example, 456' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrestadorDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+5511977776666' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrestadorDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'prestador@example.com' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreatePrestadorDto.prototype, "email", void 0);
class UpdatePrestadorDto {
    name;
    document;
    documentType;
    address;
    phone;
    email;
}
exports.UpdatePrestadorDto = UpdatePrestadorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrestadorDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrestadorDto.prototype, "document", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: DocumentType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DocumentType),
    __metadata("design:type", String)
], UpdatePrestadorDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrestadorDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePrestadorDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdatePrestadorDto.prototype, "email", void 0);
//# sourceMappingURL=prestador.dto.js.map