import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { LoggerService } from './common/';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { RequestLoggerInterceptor } from './common/interceptors/request-logger.interceptor';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(LoggerService);
  app.useLogger(logger);
  app.flushLogs();

  setupSwagger(app);

  // Use the class-validator globally
  app.useGlobalPipes(new ValidationPipe());

  // Custom HTTP exception
  app.useGlobalFilters(
    new HttpExceptionFilter(logger),
    new PrismaClientExceptionFilter(),
  );

  app.useGlobalInterceptors(
    // Class serializer for object transformations
    new ClassSerializerInterceptor(app.get(Reflector)),
    // Log HTTP request
    new RequestLoggerInterceptor(logger),
  );

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('app.port');

  try {
    await app.listen(port);
    logger.log(
      `listening on http://127.0.0.1:${port}`,
      'NestExpressApplication',
    );
  } catch (err) {
    logger.error(err, 'NestExpressApplication');
  }
}
bootstrap();
