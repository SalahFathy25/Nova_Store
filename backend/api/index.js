const path = require('path');
const fs = require('fs');

// Ensure we can find pg at runtime
const originalRequire = require;
const moduleResolvePaths = [
  path.join(__dirname, '..', 'node_modules'),
  path.join(__dirname, '..', '..', 'node_modules'),
];

module.exports = async function handler(req, res) {
  try {
    // Dynamically load the built NestJS app
    const mainPath = path.join(__dirname, '..', 'dist', 'main.js');

    if (!fs.existsSync(mainPath)) {
      return res.status(500).json({
        error: 'Build not found',
        message: 'The application has not been built yet.',
      });
    }

    // Import the bootstrap function from dist/main.js
    const mainModule = await import(mainPath);
    const bootstrap = mainModule.default || mainModule.bootstrap;

    if (typeof bootstrap === 'function') {
      // For serverless, we need a different approach
      // The NestJS app should already be initialized
      const { NestFactory } = require('@nestjs/core');
      const { AppModule } = require('../dist/app.module.js');
      const { ValidationPipe } = require('@nestjs/common');

      const app = await NestFactory.create(AppModule, {
        logger: false,
      });

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );

      app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || ['*'],
        credentials: true,
      });

      await app.init();

      const expressApp = app.getHttpAdapter().getInstance();
      return expressApp(req, res);
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message || 'Unknown error',
    });
  }
};
