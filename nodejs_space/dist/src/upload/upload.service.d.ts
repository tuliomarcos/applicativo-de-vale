import { PrismaService } from '../database/prisma.service';
export declare class UploadService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generatePresignedUploadUrl(fileName: string, contentType: string, isPublic: boolean): Promise<{
        uploadUrl: string;
        cloud_storage_path: string;
    }>;
    completeUpload(userId: string, cloud_storage_path: string, fileName: string, contentType: string, isPublic: boolean, empresaId?: string): Promise<{
        id: any;
        cloud_storage_path: string;
        url: string;
    }>;
    initiateMultipartUpload(fileName: string, contentType: string, isPublic: boolean): Promise<{
        uploadId: string;
        cloud_storage_path: string;
    }>;
    getPresignedUrlForPart(cloud_storage_path: string, uploadId: string, partNumber: number): Promise<string>;
    completeMultipartUpload(cloud_storage_path: string, uploadId: string, parts: Array<{
        ETag: string;
        PartNumber: number;
    }>): Promise<void>;
    getFileUrl(fileId: string, mode: string): Promise<{
        url: string;
    }>;
    deleteFile(fileId: string): Promise<{
        success: boolean;
    }>;
}
