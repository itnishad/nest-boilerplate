import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_PROVIDER));

  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(configService.get<number>('port') ?? 3000);
}
bootstrap();
