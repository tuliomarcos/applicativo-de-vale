import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateEmpresaDto {
  @ApiProperty({ example: 'Terraplanagem Corp' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsNotEmpty()
  @IsString()
  cnpj: string;

  @ApiProperty({ example: 'Rua Example, 789' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '+5511966665555' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '#FF5733' })
  @IsNotEmpty()
  @IsString()
  primaryColor: string;

  @ApiProperty({ example: '#33FF57' })
  @IsNotEmpty()
  @IsString()
  secondaryColor: string;
}

export class UpdateEmpresaDto {
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
  @IsString()
  primaryColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secondaryColor?: string;
}
