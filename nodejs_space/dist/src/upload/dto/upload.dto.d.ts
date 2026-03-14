export declare class PresignedUploadDto {
    fileName: string;
    contentType: string;
    isPublic: boolean;
}
export declare class CompleteUploadDto {
    cloud_storage_path: string;
    fileName: string;
    contentType: string;
    isPublic: boolean;
    empresaId?: string;
}
export declare class InitiateMultipartDto {
    fileName: string;
    contentType: string;
    isPublic: boolean;
}
export declare class GetPartUrlDto {
    cloud_storage_path: string;
    uploadId: string;
    partNumber: number;
}
export declare class CompleteMultipartDto {
    cloud_storage_path: string;
    uploadId: string;
    parts: Array<{
        ETag: string;
        PartNumber: number;
    }>;
}
