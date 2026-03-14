import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ValesModule } from '../vales/vales.module';

@Module({
  imports: [ValesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
