import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule, ThrottlerStorageService } from '@nestjs/throttler'
import { THROTTLER_CONFIG } from "../config/throttler.config";
import Redis from "ioredis";
import {ThrottlerStorageRedisService} from '@nest-lab/throttler-storage-redis'
import { APP_GUARD } from "@nestjs/core";

@Global()
@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const redisClient = new Redis({
                    host: configService.get<string>('REDIS_HOST', 'localhost'),
                    port: configService.get<number>('REDIS_PORT', 6379),
                })
                return {
                    throttlers: [
                        {
                            name: 'default',
                            ttl: THROTTLER_CONFIG.DEFAULT.ttl,
                            limit: THROTTLER_CONFIG.DEFAULT.limit,
                        },
                        {
                            name: 'strict',
                            ttl: THROTTLER_CONFIG.STRICT.ttl,
                            limit: THROTTLER_CONFIG.STRICT.limit,
                        },
                        {
                            name: 'auth',
                            ttl: THROTTLER_CONFIG.AUTH.ttl,
                            limit: THROTTLER_CONFIG.AUTH.limit,
                        },
                        {
                            name: 'relaxed',
                            ttl: THROTTLER_CONFIG.RELAXED.ttl,
                            limit: THROTTLER_CONFIG.RELAXED.limit,
                        },
                    ],
                    storage: new ThrottlerStorageRedisService(redisClient)
                }
            },
            inject: [ConfigService]
        })
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
    exports: [ThrottlerModule]
})
export class RateLimitModule { }