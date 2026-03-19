import { UploadService } from './upload.service';
import { PresignedUploadDto, CompleteUploadDto, InitiateMultipartDto, GetPartUrlDto, CompleteMultipartDto } from './dto/upload.dto';
import type { AuthUser, CompleteUploadResponse, FileUrlResponse, MultipartInitResponse, PartUrlResponse, PresignedUploadResponse, SuccessResponse } from '../types/api';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    generatePresignedUrl(dto: PresignedUploadDto): Promise<PresignedUploadResponse>;
    completeUpload(user: AuthUser, dto: CompleteUploadDto): Promise<CompleteUploadResponse>;
    initiateMultipart(dto: InitiateMultipartDto): Promise<MultipartInitResponse>;
    getPartUrl(dto: GetPartUrlDto): Promise<PartUrlResponse>;
    completeMultipart(dto: CompleteMultipartDto): Promise<SuccessResponse>;
    getFileUrl(id: string, mode?: 'view' | 'download'): Promise<FileUrlResponse>;
    deleteFile(id: string): Promise<SuccessResponse>;
}
