import { PrismaService } from '../database/prisma.service';
import { CompleteUploadResponse, FileUrlResponse, MultipartInitResponse, PresignedUploadResponse, SuccessResponse } from '../types/api';
export declare class UploadService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generatePresignedUploadUrl(fileName: string, contentType: string, isPublic: boolean): Promise<PresignedUploadResponse>;
    completeUpload(userId: string, cloud_storage_path: string, fileName: string, contentType: string, isPublic: boolean, empresaId?: string): Promise<CompleteUploadResponse>;
    initiateMultipartUpload(fileName: string, contentType: string, isPublic: boolean): Promise<MultipartInitResponse>;
    getPresignedUrlForPart(cloud_storage_path: string, uploadId: string, partNumber: number): Promise<string>;
    completeMultipartUpload(cloud_storage_path: string, uploadId: string, parts: Array<{
        ETag: string;
        PartNumber: number;
    }>): Promise<void>;
    getFileUrl(fileId: string, mode: 'view' | 'download'): Promise<FileUrlResponse>;
    deleteFile(fileId: string): Promise<SuccessResponse>;
}
