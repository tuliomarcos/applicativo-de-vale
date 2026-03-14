import { UploadService } from './upload.service';
import { PresignedUploadDto, CompleteUploadDto, InitiateMultipartDto, GetPartUrlDto, CompleteMultipartDto } from './dto/upload.dto';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    generatePresignedUrl(dto: PresignedUploadDto): Promise<{
        uploadUrl: string;
        cloud_storage_path: string;
    }>;
    completeUpload(user: any, dto: CompleteUploadDto): Promise<{
        id: string;
        cloud_storage_path: string;
        url: string;
    }>;
    initiateMultipart(dto: InitiateMultipartDto): Promise<{
        uploadId: string;
        cloud_storage_path: string;
    }>;
    getPartUrl(dto: GetPartUrlDto): Promise<{
        url: string;
    }>;
    completeMultipart(dto: CompleteMultipartDto): Promise<{
        success: boolean;
    }>;
    getFileUrl(id: string, mode: string): Promise<{
        url: string;
    }>;
    deleteFile(id: string): Promise<{
        success: boolean;
    }>;
}
