import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './common/redis/redis.module';
import { WinstonModule } from 'nest-winston';
import config from './common/config/app.config'
import { winstonConfig } from './common/config/winston.config';
import { LoggerModule } from './common/modules/logger.module';
import { RateLimitModule } from './common/modules/rate-limit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    WinstonModule.forRoot(winstonConfig),
    DatabaseModule,
    RedisModule,
    LoggerModule,
    RateLimitModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
