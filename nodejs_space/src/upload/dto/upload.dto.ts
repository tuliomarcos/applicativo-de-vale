import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class PresignedUploadDto {
  @ApiProperty({ example: 'logo.png' })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'image/png' })
  @IsNotEmpty()
  @IsString()
  contentType: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}

export class CompleteUploadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cloud_storage_path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contentType: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  empresaId?: string;
}

export class InitiateMultipartDto {
  @ApiProperty({ example: 'large-file.pdf' })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsNotEmpty()
  @IsString()
  contentType: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}

export class GetPartUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cloud_storage_path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  uploadId: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  partNumber: number;
}

export class CompleteMultipartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cloud_storage_path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  uploadId: string;

  @ApiProperty({
    example: [{ ETag: 'etag1', PartNumber: 1 }],
    type: 'array',
  })
  @IsNotEmpty()
  @IsArray()
  parts: Array<{ ETag: string; PartNumber: number }>;
}
