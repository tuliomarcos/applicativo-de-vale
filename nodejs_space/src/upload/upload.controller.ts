import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  PresignedUploadDto,
  CompleteUploadDto,
  InitiateMultipartDto,
  GetPartUrlDto,
  CompleteMultipartDto,
} from './dto/upload.dto';
import {
  AuthUser,
  CompleteUploadResponse,
  FileUrlResponse,
  MultipartInitResponse,
  PartUrlResponse,
  PresignedUploadResponse,
  SuccessResponse,
} from '../types/api';

@ApiTags('File Upload')
@Controller('api/upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned')
  @ApiOperation({ summary: 'Generate presigned upload URL' })
  @ApiResponse({ status: 200, description: 'Presigned URL generated' })
  async generatePresignedUrl(
    @Body() dto: PresignedUploadDto,
  ): Promise<PresignedUploadResponse> {
    return this.uploadService.generatePresignedUploadUrl(
      dto.fileName,
      dto.contentType,
      dto.isPublic,
    );
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete file upload' })
  @ApiResponse({ status: 200, description: 'Upload completed' })
  async completeUpload(
    @CurrentUser() user: AuthUser,
    @Body() dto: CompleteUploadDto,
  ): Promise<CompleteUploadResponse> {
    return this.uploadService.completeUpload(
      user.userId,
      dto.cloud_storage_path,
      dto.fileName,
      dto.contentType,
      dto.isPublic,
      dto.empresaId,
    );
  }

  @Post('multipart/initiate')
  @ApiOperation({ summary: 'Initiate multipart upload' })
  @ApiResponse({ status: 200, description: 'Multipart upload initiated' })
  async initiateMultipart(
    @Body() dto: InitiateMultipartDto,
  ): Promise<MultipartInitResponse> {
    return this.uploadService.initiateMultipartUpload(
      dto.fileName,
      dto.contentType,
      dto.isPublic,
    );
  }

  @Post('multipart/part')
  @ApiOperation({ summary: 'Get presigned URL for multipart upload part' })
  @ApiResponse({ status: 200, description: 'Presigned URL for part generated' })
  async getPartUrl(@Body() dto: GetPartUrlDto): Promise<PartUrlResponse> {
    const url = await this.uploadService.getPresignedUrlForPart(
      dto.cloud_storage_path,
      dto.uploadId,
      dto.partNumber,
    );
    return { url };
  }

  @Post('multipart/complete')
  @ApiOperation({ summary: 'Complete multipart upload' })
  @ApiResponse({ status: 200, description: 'Multipart upload completed' })
  async completeMultipart(
    @Body() dto: CompleteMultipartDto,
  ): Promise<SuccessResponse> {
    await this.uploadService.completeMultipartUpload(
      dto.cloud_storage_path,
      dto.uploadId,
      dto.parts,
    );
    return { success: true };
  }

  @Get('files/:id/url')
  @ApiOperation({ summary: 'Get file URL' })
  @ApiResponse({ status: 200, description: 'File URL retrieved' })
  async getFileUrl(
    @Param('id') id: string,
    @Query('mode') mode: 'view' | 'download' = 'view',
  ): Promise<FileUrlResponse> {
    return this.uploadService.getFileUrl(id, mode);
  }

  @Delete('files/:id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted' })
  async deleteFile(@Param('id') id: string): Promise<SuccessResponse> {
    return this.uploadService.deleteFile(id);
  }
}
