import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePrestadorDto {
  @ApiProperty({ example: 'Jose da Silva' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ example: 'ABC-1234' })
  @IsNotEmpty()
  @IsString()
  vehiclePlate: string;

  @ApiProperty({ example: '+5511977776666' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'prestador@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Rua Example, 456', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdatePrestadorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  vehiclePlate?: string;

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
  email?: string;
}
