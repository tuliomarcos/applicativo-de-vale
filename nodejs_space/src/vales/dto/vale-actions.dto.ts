import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsEmail, IsUUID } from 'class-validator';

export class GeneratePdfDto {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  valeIds: string[];
}

export class SendEmailDto {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  valeIds: string[];

  @ApiProperty({ example: 'recipient@example.com' })
  @IsNotEmpty()
  @IsEmail()
  recipientEmail: string;
}

export class ShareLinkDto {
  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  valeIds: string[];
}
