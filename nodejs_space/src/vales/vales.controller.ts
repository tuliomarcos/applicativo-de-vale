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
import { ValesService } from './vales.service';
import { PdfService } from './pdf.service';
import { EmailService } from './email.service';
import {
  CreateValeViagemDto,
  CreateValeDiariaDto,
  UpdateValeDto,
} from './dto/vale.dto';
import {
  GeneratePdfDto,
  SendEmailDto,
  ShareLinkDto,
} from './dto/vale-actions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type {
  AuthUser,
  PaginatedResponse,
  PdfResponse,
  SendEmailResponse,
  ShareLinkResponse,
  SuccessResponse,
  ValeResponse,
} from '../types/api';

@ApiTags('Vales (Vouchers)')
@Controller('api/vales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ValesController {
  constructor(
    private readonly valesService: ValesService,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService,
  ) {}

  @Post('viagem')
  @ApiOperation({ summary: 'Create Vale Viagem' })
  @ApiResponse({ status: 201, description: 'Vale Viagem created' })
  async createValeViagem(
    @CurrentUser() user: AuthUser,
    @Body() createDto: CreateValeViagemDto,
  ): Promise<ValeResponse> {
    return this.valesService.createValeViagem(user.userId, createDto);
  }

  @Post('diaria')
  @ApiOperation({ summary: 'Create Vale Diária' })
  @ApiResponse({ status: 201, description: 'Vale Diária created' })
  async createValeDiaria(
    @CurrentUser() user: AuthUser,
    @Body() createDto: CreateValeDiariaDto,
  ): Promise<ValeResponse> {
    return this.valesService.createValeDiaria(user.userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vales' })
  @ApiQuery({ name: 'type', required: false, enum: ['VIAGEM', 'DIARIA'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Vales retrieved' })
  async findAll(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedResponse<ValeResponse>> {
    return this.valesService.findAll(
      type,
      search,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vale by ID' })
  @ApiResponse({ status: 200, description: 'Vale retrieved' })
  @ApiResponse({ status: 404, description: 'Vale not found' })
  async findOne(@Param('id') id: string): Promise<ValeResponse> {
    return this.valesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vale (EMPRESA only)' })
  @ApiResponse({ status: 200, description: 'Vale updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() updateDto: UpdateValeDto,
  ): Promise<ValeResponse> {
    return this.valesService.update(id, user.userId, user.role, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vale (EMPRESA only)' })
  @ApiResponse({ status: 200, description: 'Vale deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ): Promise<SuccessResponse> {
    return this.valesService.delete(id, user.role);
  }

  @Post('pdf')
  @ApiOperation({ summary: 'Generate PDF for vales' })
  @ApiResponse({ status: 200, description: 'PDF generated' })
  async generatePdf(
    @CurrentUser() user: AuthUser,
    @Body() dto: GeneratePdfDto,
  ): Promise<PdfResponse> {
    return this.pdfService.generatePdf(user.userId, dto.valeIds);
  }

  @Post('send-email')
  @ApiOperation({ summary: 'Send vales via email' })
  @ApiResponse({ status: 200, description: 'Email sent' })
  async sendEmail(
    @CurrentUser() user: AuthUser,
    @Body() dto: SendEmailDto,
  ): Promise<SendEmailResponse> {
    return this.emailService.sendValesEmail(
      user.userId,
      dto.valeIds,
      dto.recipientEmail,
    );
  }

  @Post('share-link')
  @ApiOperation({ summary: 'Generate WhatsApp share link' })
  @ApiResponse({ status: 200, description: 'Share link generated' })
  async generateShareLink(
    @CurrentUser() user: AuthUser,
    @Body() dto: ShareLinkDto,
  ): Promise<ShareLinkResponse> {
    const pdfResult = await this.pdfService.generatePdf(
      user.userId,
      dto.valeIds,
    );
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Confira os vales: ${pdfResult.pdfUrl}`)}`;
    return {
      pdfUrl: pdfResult.pdfUrl,
      whatsappUrl,
    };
  }
}
