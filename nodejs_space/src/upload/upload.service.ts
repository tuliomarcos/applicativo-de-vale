import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as s3 from '../lib/s3';
import {
  CompleteUploadResponse,
  FileUrlResponse,
  MultipartInitResponse,
  PresignedUploadResponse,
  SuccessResponse,
} from '../types/api';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private prisma: PrismaService) {}

  async generatePresignedUploadUrl(
    fileName: string,
    contentType: string,
    isPublic: boolean,
  ): Promise<PresignedUploadResponse> {
    try {
      const result = await s3.generatePresignedUploadUrl(
        fileName,
        contentType,
        isPublic,
      );
      this.logger.log(`Generated presigned upload URL for ${fileName}`);
      return result;
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error.message}`);
      throw error;
    }
  }

  async completeUpload(
    userId: string,
    cloud_storage_path: string,
    fileName: string,
    contentType: string,
    isPublic: boolean,
    empresaId?: string,
  ): Promise<CompleteUploadResponse> {
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
    } catch (error) {
      this.logger.error(`Error completing upload: ${error.message}`);
      throw error;
    }
  }

  async initiateMultipartUpload(
    fileName: string,
    contentType: string,
    isPublic: boolean,
  ): Promise<MultipartInitResponse> {
    try {
      const result = await s3.initiateMultipartUpload(
        fileName,
        contentType,
        isPublic,
      );
      this.logger.log(`Initiated multipart upload for ${fileName}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error initiating multipart upload: ${error.message}`,
      );
      throw error;
    }
  }

  async getPresignedUrlForPart(
    cloud_storage_path: string,
    uploadId: string,
    partNumber: number,
  ): Promise<string> {
    try {
      return await s3.getPresignedUrlForPart(
        cloud_storage_path,
        uploadId,
        partNumber,
      );
    } catch (error) {
      this.logger.error(
        `Error getting presigned URL for part: ${error.message}`,
      );
      throw error;
    }
  }

  async completeMultipartUpload(
    cloud_storage_path: string,
    uploadId: string,
    parts: Array<{ ETag: string; PartNumber: number }>,
  ): Promise<void> {
    try {
      await s3.completeMultipartUpload(cloud_storage_path, uploadId, parts);
      this.logger.log(`Completed multipart upload for ${cloud_storage_path}`);
    } catch (error) {
      this.logger.error(
        `Error completing multipart upload: ${error.message}`,
      );
      throw error;
    }
  }

  async getFileUrl(
    fileId: string,
    mode: 'view' | 'download',
  ): Promise<FileUrlResponse> {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      const url = await s3.getFileUrl(file.cloud_storage_path, file.isPublic);

      return { url };
    } catch (error) {
      this.logger.error(`Error getting file URL: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<SuccessResponse> {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      await s3.deleteFile(file.cloud_storage_path);
      await this.prisma.file.delete({ where: { id: fileId } });

      this.logger.log(`File deleted: ${fileId}`);

      return { success: true };
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }
}
