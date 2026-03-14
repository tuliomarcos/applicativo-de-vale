import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Client Corp' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsNotEmpty()
  @IsString()
  cnpj: string;

  @ApiProperty({ example: 'Rua Example, 123' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '+5511988887777' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'client@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateClientDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

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
