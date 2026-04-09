import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

@ApiTags('Vales (Vouchers)')
@Controller('api/vales')
export class ValesPublicController {
  @Get('local-pdf/:fileName')
  @ApiOperation({ summary: 'Get locally generated PDF fallback' })
  @ApiResponse({ status: 200, description: 'PDF file retrieved' })
  async getLocalPdf(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
      throw new NotFoundException('PDF file not found');
    }

    const filePath = join(process.cwd(), 'uploads', 'pdfs', fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException('PDF file not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=\"${fileName}\"`);
    res.sendFile(filePath);
  }
}
