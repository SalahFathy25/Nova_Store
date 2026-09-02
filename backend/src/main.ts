import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { seedDatabase } from './database/seeds/seed.js';
import { DataSource } from 'typeorm';
import { appConfig } from './config/app.config.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: appConfig.corsOrigins,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('NOVA Commerce API')
    .setDescription('White-Label E-Commerce & Delivery Platform API')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-Tenant-ID', in: 'header' }, 'tenant-id')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const dataSource = app.get(DataSource);

  logger.log('Syncing database schema...');
  await dataSource.synchronize();
  logger.log('Schema synced successfully.');

  await seedDatabase(dataSource);

  await app.listen(appConfig.port);
  logger.log(`Application running on: http://localhost:${appConfig.port}`);
  logger.log(`API Documentation: http://localhost:${appConfig.port}/docs`);
}

bootstrap();
