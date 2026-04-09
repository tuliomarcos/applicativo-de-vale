import { Module } from '@nestjs/common';
import { ValesController } from './vales.controller';
import { ValesPublicController } from './vales-public.controller';
import { ValesService } from './vales.service';
import { PdfService } from './pdf.service';
import { EmailService } from './email.service';
import { EmpresaModule } from '../empresa/empresa.module';

@Module({
  imports: [EmpresaModule],
  controllers: [ValesController, ValesPublicController],
  providers: [ValesService, PdfService, EmailService],
  exports: [ValesService],
})
export class ValesModule {}
