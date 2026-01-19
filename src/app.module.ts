import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from '../config/winston.config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from '../config'
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, load: [config]}), 
  WinstonModule.forRootAsync({
    useFactory: () => winstonConfig
  })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*')
  }
}
