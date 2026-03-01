import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggerService, VersioningType } from '@nestjs/common';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER
} from 'nest-winston'
import { Logger } from 'winston';
import helmet from 'helmet';
import { helmetConfigForProd, helmetConfigForDev } from './common/config/helmet.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const nestLogger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(nestLogger);

  // const winstonLogger = app.get<Logger>(WINSTON_MODULE_PROVIDER)

  const configService = app.get<ConfigService>(ConfigService);
  
  const helmetConfig = isProduction ? helmetConfigForProd : helmetConfigForDev;
  app.use(helmet(helmetConfig));

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Nest example')
    .setDescription('The Nest API description')
    .setVersion('1.0')
    .addTag('nest')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json'
  });

  await app.listen(configService.get<number>('port') ?? 3000);
}
bootstrap();
