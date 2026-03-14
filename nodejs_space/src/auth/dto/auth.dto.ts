import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';

enum UserRole {
  PRESTADOR = 'PRESTADOR',
  CLIENTE = 'CLIENTE',
  EMPRESA = 'EMPRESA',
}

export class SignupDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole, example: 'EMPRESA' })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
