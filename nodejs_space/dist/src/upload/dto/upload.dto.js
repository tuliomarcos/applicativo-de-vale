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
exports.CompleteMultipartDto = exports.GetPartUrlDto = exports.InitiateMultipartDto = exports.CompleteUploadDto = exports.PresignedUploadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PresignedUploadDto {
    fileName;
    contentType;
    isPublic;
}
exports.PresignedUploadDto = PresignedUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'logo.png' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PresignedUploadDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/png' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PresignedUploadDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PresignedUploadDto.prototype, "isPublic", void 0);
class CompleteUploadDto {
    cloud_storage_path;
    fileName;
    contentType;
    isPublic;
    empresaId;
}
exports.CompleteUploadDto = CompleteUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "cloud_storage_path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CompleteUploadDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "empresaId", void 0);
class InitiateMultipartDto {
    fileName;
    contentType;
    isPublic;
}
exports.InitiateMultipartDto = InitiateMultipartDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'large-file.pdf' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateMultipartDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'application/pdf' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateMultipartDto.prototype, "contentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], InitiateMultipartDto.prototype, "isPublic", void 0);
class GetPartUrlDto {
    cloud_storage_path;
    uploadId;
    partNumber;
}
exports.GetPartUrlDto = GetPartUrlDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPartUrlDto.prototype, "cloud_storage_path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPartUrlDto.prototype, "uploadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetPartUrlDto.prototype, "partNumber", void 0);
class CompleteMultipartDto {
    cloud_storage_path;
    uploadId;
    parts;
}
exports.CompleteMultipartDto = CompleteMultipartDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteMultipartDto.prototype, "cloud_storage_path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteMultipartDto.prototype, "uploadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ ETag: 'etag1', PartNumber: 1 }],
        type: 'array',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CompleteMultipartDto.prototype, "parts", void 0);
//# sourceMappingURL=upload.dto.js.map