import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ClientsModule } from './clients/clients.module';
import { PrestadoresModule } from './prestadores/prestadores.module';
import { EmpresaModule } from './empresa/empresa.module';
import { ValesModule } from './vales/vales.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UploadModule,
    ClientsModule,
    PrestadoresModule,
    EmpresaModule,
    ValesModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
