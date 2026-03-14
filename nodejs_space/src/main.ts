import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const swaggerPath = 'api-docs';

  // Add cache-busting middleware for Swagger
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Vales de Terraplanagem API')
    .setDescription('API para gerenciamento de vales de terraplanagem com autenticação JWT')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'Vales de Terraplanagem API',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #2c3e50; font-size: 28px; }
      .swagger-ui .info .description { color: #34495e; }
      .swagger-ui .opblock-tag { font-size: 18px; color: #2c3e50; }
      .swagger-ui .opblock { border-radius: 8px; margin-bottom: 15px; }
      .swagger-ui .opblock-summary-method { border-radius: 5px; }
      body { background-color: #f8f9fa; }
      .swagger-ui .wrapper { max-width: 1200px; margin: 0 auto; }
    `,
    customfavIcon: 'data:image/svg+xml,<svg xmlns="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Emoji_u1f4dd.svg/1280px-Emoji_u1f4dd.svg.png" viewBox="0 0 100 100"><text y=".9em" font-size="90">📝</text></svg>',
  });

  await app.listen(3000);
  logger.log(`✅ Application is running on: http://localhost:3000`);
  logger.log(`📚 API Documentation available at: http://localhost:3000/${swaggerPath}`);
}
bootstrap();
