import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser, EmpresaResponse } from '../types/api';

@ApiTags('Empresa (Earthmoving Company)')
@Controller('api/empresa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  @ApiOperation({ summary: 'Create empresa profile' })
  @ApiResponse({ status: 201, description: 'Empresa created' })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createEmpresaDto: CreateEmpresaDto,
  ): Promise<EmpresaResponse> {
    return this.empresaService.create(user.userId, createEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user empresa profile' })
  @ApiResponse({ status: 200, description: 'Empresa retrieved' })
  async getEmpresa(
    @CurrentUser() user: AuthUser,
  ): Promise<EmpresaResponse | null> {
    return this.empresaService.getByUserId(user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update empresa profile' })
  @ApiResponse({ status: 200, description: 'Empresa updated' })
  async update(
    @Param('id') id: string,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<EmpresaResponse> {
    return this.empresaService.update(id, updateEmpresaDto);
  }
}
