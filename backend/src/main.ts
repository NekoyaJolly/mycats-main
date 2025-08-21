import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { validateAndLogConfig } from './config/env.validation';

async function bootstrap() {
  // 環境変数の検証
  const config = validateAndLogConfig();
  
  const logger = new Logger('Bootstrap');

  try {
    logger.log('🚀 Cat Management System API を開始中...');

    const app = await NestFactory.create(AppModule);

    // Security headers
    app.use(helmet());

    // Enhanced CORS configuration
    app.enableCors({
      origin:
        process.env.NODE_ENV === 'production'
          ? config.CORS_ORIGIN?.split(',') || ['https://mycats.example.com']
          : [
              `http://localhost:${config.FRONTEND_PORT}`,
              'http://localhost:3000',
              'http://localhost:3002',
              'http://localhost:3005',
            ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Global exception filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // API prefix
    app.setGlobalPrefix('api/v1');

    // Root endpoint
    app.getHttpAdapter().get('/', (req, res) => {
      res.json({
        message: '🐱 Cat Management System API',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health',
        timestamp: new Date().toISOString(),
        endpoints: {
          cats: '/api/v1/cats',
          pedigrees: '/api/v1/pedigrees',
          breeds: '/api/v1/breeds',
          coatColors: '/api/v1/coat-colors',
        },
      });
    });

    // Health check endpoint
    app.getHttpAdapter().get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Cat Management System API',
        version: '1.0.0',
      });
    });

    // Swagger documentation
    if (process.env.NODE_ENV !== 'production') {
      const swaggerConfig = new DocumentBuilder()
        .setTitle('Cat Management System API')
        .setDescription('API for managing cat breeding and care records')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, swaggerConfig);
      SwaggerModule.setup('api/docs', app, document);
    }

    const port = config.BACKEND_PORT;
    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    logger.log(`❤️  Health Check: http://localhost:${port}/health`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  const logger = new Logger('Bootstrap');
  logger.error('Unhandled error during bootstrap:', error);
  process.exit(1);
});
