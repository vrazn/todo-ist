import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  await app.register(compression, { encodings: ['gzip', 'deflate'] });
  await app.register(helmet);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
