"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const s3 = __importStar(require("../lib/s3"));
let UploadService = UploadService_1 = class UploadService {
    prisma;
    logger = new common_1.Logger(UploadService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generatePresignedUploadUrl(fileName, contentType, isPublic) {
        try {
            const result = await s3.generatePresignedUploadUrl(fileName, contentType, isPublic);
            this.logger.log(`Generated presigned upload URL for ${fileName}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error generating presigned URL: ${error.message}`);
            throw error;
        }
    }
    async completeUpload(userId, cloud_storage_path, fileName, contentType, isPublic, empresaId) {
        try {
            const file = await this.prisma.file.create({
                data: {
                    userId,
                    fileName,
                    cloud_storage_path,
                    isPublic,
                    contentType,
                },
            });
            if (empresaId) {
                await this.prisma.empresa.update({
                    where: { id: empresaId },
                    data: { logoFileId: file.id },
                });
            }
            const url = await s3.getFileUrl(cloud_storage_path, isPublic);
            this.logger.log(`File upload completed: ${fileName}`);
            return { id: file.id, cloud_storage_path, url };
        }
        catch (error) {
            this.logger.error(`Error completing upload: ${error.message}`);
            throw error;
        }
    }
    async initiateMultipartUpload(fileName, contentType, isPublic) {
        try {
            const result = await s3.initiateMultipartUpload(fileName, contentType, isPublic);
            this.logger.log(`Initiated multipart upload for ${fileName}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error initiating multipart upload: ${error.message}`);
            throw error;
        }
    }
    async getPresignedUrlForPart(cloud_storage_path, uploadId, partNumber) {
        try {
            return await s3.getPresignedUrlForPart(cloud_storage_path, uploadId, partNumber);
        }
        catch (error) {
            this.logger.error(`Error getting presigned URL for part: ${error.message}`);
            throw error;
        }
    }
    async completeMultipartUpload(cloud_storage_path, uploadId, parts) {
        try {
            await s3.completeMultipartUpload(cloud_storage_path, uploadId, parts);
            this.logger.log(`Completed multipart upload for ${cloud_storage_path}`);
        }
        catch (error) {
            this.logger.error(`Error completing multipart upload: ${error.message}`);
            throw error;
        }
    }
    async getFileUrl(fileId, mode) {
        try {
            const file = await this.prisma.file.findUnique({
                where: { id: fileId },
            });
            if (!file) {
                throw new common_1.NotFoundException('File not found');
            }
            const url = await s3.getFileUrl(file.cloud_storage_path, file.isPublic);
            return { url };
        }
        catch (error) {
            this.logger.error(`Error getting file URL: ${error.message}`);
            throw error;
        }
    }
    async deleteFile(fileId) {
        try {
            const file = await this.prisma.file.findUnique({
                where: { id: fileId },
            });
            if (!file) {
                throw new common_1.NotFoundException('File not found');
            }
            await s3.deleteFile(file.cloud_storage_path);
            await this.prisma.file.delete({ where: { id: fileId } });
            this.logger.log(`File deleted: ${fileId}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Error deleting file: ${error.message}`);
            throw error;
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map