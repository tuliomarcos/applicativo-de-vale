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
exports.UpdateValeDto = exports.CreateValeDiariaDto = exports.CreateValeViagemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TripType;
(function (TripType) {
    TripType["ENTULHO"] = "ENTULHO";
    TripType["TERRA"] = "TERRA";
})(TripType || (TripType = {}));
class CreateValeViagemDto {
    clientId;
    truckPlate;
    driverName;
    tripType;
    workLocation;
    date;
    signatureData;
}
exports.CreateValeViagemDto = CreateValeViagemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateValeViagemDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ABC-1234' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeViagemDto.prototype, "truckPlate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João Silva' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeViagemDto.prototype, "driverName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TripType, example: 'ENTULHO' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(TripType),
    __metadata("design:type", String)
], CreateValeViagemDto.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'São Paulo - SP' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeViagemDto.prototype, "workLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-03-11T10:00:00.000Z' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeViagemDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeViagemDto.prototype, "signatureData", void 0);
class CreateValeDiariaDto {
    clientId;
    operatorName;
    workLocation;
    date;
    morningStart;
    morningEnd;
    afternoonStart;
    afternoonEnd;
    totalHours;
    equipment;
    signatureData;
}
exports.CreateValeDiariaDto = CreateValeDiariaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Carlos Souza' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "operatorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rio de Janeiro - RJ' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "workLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-03-11T10:00:00.000Z' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:00' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "morningStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12:00' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "morningEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '13:00' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "afternoonStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '17:00' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "afternoonEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateValeDiariaDto.prototype, "totalHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Escavadeira Hidráulica' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "equipment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateValeDiariaDto.prototype, "signatureData", void 0);
class UpdateValeDto {
    workLocation;
    truckPlate;
    driverName;
    tripType;
    operatorName;
    morningStart;
    morningEnd;
    afternoonStart;
    afternoonEnd;
    totalHours;
    equipment;
}
exports.UpdateValeDto = UpdateValeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "workLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "truckPlate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "driverName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TripType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TripType),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "operatorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "morningStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "morningEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "afternoonStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "afternoonEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateValeDto.prototype, "totalHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateValeDto.prototype, "equipment", void 0);
//# sourceMappingURL=vale.dto.js.map