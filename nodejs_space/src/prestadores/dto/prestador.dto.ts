import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';

enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

export class CreatePrestadorDto {
  @ApiProperty({ example: 'Service Provider Inc' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({ enum: DocumentType, example: 'CPF' })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ example: 'Rua Example, 456' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '+5511977776666' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'prestador@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdatePrestadorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({ enum: DocumentType, required: false })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
