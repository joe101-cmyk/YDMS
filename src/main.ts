import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { swaggerConfig } from './common/config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { appConfig } from './common/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(appConfig.port);
  console.log(`SERVER RUNNING ${appConfig.port}`);
}

bootstrap();
