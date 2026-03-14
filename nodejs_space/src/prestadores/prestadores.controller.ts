import {
  Controller,
  Post,
  Get,
  Patch,
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
  ApiQuery,
} from '@nestjs/swagger';
import { PrestadoresService } from './prestadores.service';
import {
  CreatePrestadorDto,
  UpdatePrestadorDto,
} from './dto/prestador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Prestadores (Service Providers)')
@Controller('api/prestadores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrestadoresController {
  constructor(private readonly prestadoresService: PrestadoresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prestador' })
  @ApiResponse({ status: 201, description: 'Prestador created' })
  async create(
    @CurrentUser() user: any,
    @Body() createPrestadorDto: CreatePrestadorDto,
  ) {
    return this.prestadoresService.create(user.userId, createPrestadorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prestadores' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Prestadores retrieved' })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prestadoresService.findAll(
      search,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prestador by ID' })
  @ApiResponse({ status: 200, description: 'Prestador retrieved' })
  @ApiResponse({ status: 404, description: 'Prestador not found' })
  async findOne(@Param('id') id: string) {
    return this.prestadoresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update prestador' })
  @ApiResponse({ status: 200, description: 'Prestador updated' })
  async update(
    @Param('id') id: string,
    @Body() updatePrestadorDto: UpdatePrestadorDto,
  ) {
    return this.prestadoresService.update(id, updatePrestadorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete prestador' })
  @ApiResponse({ status: 200, description: 'Prestador deleted' })
  async delete(@Param('id') id: string) {
    return this.prestadoresService.delete(id);
  }
}
