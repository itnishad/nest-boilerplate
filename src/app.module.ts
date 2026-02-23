import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './common/redis/redis.module';
import config from '../config'


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true, load: [config]}), DatabaseModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
