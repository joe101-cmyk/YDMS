import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('E-Commerce API')
  .setDescription('Production-ready NestJS e-commerce backend')
  .setVersion('1.0')
  .addServer('/v1', 'Version 1')
  .addBearerAuth()
  .build();
