import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

enum TripType {
  ENTULHO = 'ENTULHO',
  TERRA = 'TERRA',
}

export class CreateValeViagemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: 'ABC-1234' })
  @IsNotEmpty()
  @IsString()
  truckPlate: string;

  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty()
  @IsString()
  driverName: string;

  @ApiProperty({ enum: TripType, example: 'ENTULHO' })
  @IsNotEmpty()
  @IsEnum(TripType)
  tripType: TripType;

  @ApiProperty({ example: 'São Paulo - SP' })
  @IsNotEmpty()
  @IsString()
  workLocation: string;

  @ApiProperty({ example: '2026-03-11T10:00:00.000Z' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...' })
  @IsNotEmpty()
  @IsString()
  signatureData: string;
}

export class CreateValeDiariaDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @ApiProperty({ example: 'Carlos Souza' })
  @IsNotEmpty()
  @IsString()
  operatorName: string;

  @ApiProperty({ example: 'Rio de Janeiro - RJ' })
  @IsNotEmpty()
  @IsString()
  workLocation: string;

  @ApiProperty({ example: '2026-03-11T10:00:00.000Z' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ example: '08:00' })
  @IsNotEmpty()
  @IsString()
  morningStart: string;

  @ApiProperty({ example: '12:00' })
  @IsNotEmpty()
  @IsString()
  morningEnd: string;

  @ApiProperty({ example: '13:00' })
  @IsNotEmpty()
  @IsString()
  afternoonStart: string;

  @ApiProperty({ example: '17:00' })
  @IsNotEmpty()
  @IsString()
  afternoonEnd: string;

  @ApiProperty({ example: 8 })
  @IsNotEmpty()
  @IsNumber()
  totalHours: number;

  @ApiProperty({ example: 'Escavadeira Hidráulica' })
  @IsNotEmpty()
  @IsString()
  equipment: string;

  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...' })
  @IsNotEmpty()
  @IsString()
  signatureData: string;
}

export class UpdateValeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  workLocation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  truckPlate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  driverName?: string;

  @ApiProperty({ enum: TripType, required: false })
  @IsOptional()
  @IsEnum(TripType)
  tripType?: TripType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  operatorName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  morningStart?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  morningEnd?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  afternoonStart?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  afternoonEnd?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalHours?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  equipment?: string;
}
