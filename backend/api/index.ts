import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module.js';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter.js';
import { appConfig } from '../src/config/app.config.js';

let app: NestExpressApplication | null = null;

async function createApp(): Promise<NestExpressApplication> {
  if (app) return app;

  const logger = new Logger('Vercel');

  try {
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log'],
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

    await app.init();
    logger.log('App initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize app:', error);
    throw error;
  }

  return app;
}

export default async function handler(req: any, res: any) {
  try {
    const appInstance = await createApp();
    const expressApp = appInstance.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error?.message || 'Unknown error' });
  }
}
