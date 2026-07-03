import { Module } from '@nestjs/common';
import { AppController } from '#src/app.controller';
import { AppService } from '#src/app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '#src/database/database.module';
import { RedisModule } from '#src/common/redis/redis.module';
import { WinstonModule } from 'nest-winston';
import config from '#src/common/config/app.config'
import { winstonConfig } from '#src/common/config/winston.config';
import { LoggerModule } from '#src/common/modules/logger.module';
import { RateLimitModule } from '#src/common/modules/rate-limit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'], load: [config] }),
    WinstonModule.forRoot(winstonConfig),
    DatabaseModule,
    // RedisModule,
    LoggerModule,
    // RateLimitModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
