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
exports.ShareLinkDto = exports.SendEmailDto = exports.GeneratePdfDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GeneratePdfDto {
    valeIds;
}
exports.GeneratePdfDto = GeneratePdfDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        type: [String],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], GeneratePdfDto.prototype, "valeIds", void 0);
class SendEmailDto {
    valeIds;
    recipientEmail;
}
exports.SendEmailDto = SendEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        type: [String],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], SendEmailDto.prototype, "valeIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'recipient@example.com' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "recipientEmail", void 0);
class ShareLinkDto {
    valeIds;
}
exports.ShareLinkDto = ShareLinkDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        type: [String],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], ShareLinkDto.prototype, "valeIds", void 0);
//# sourceMappingURL=vale-actions.dto.js.map