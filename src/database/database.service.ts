import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(confgiService: ConfigService) {
        const connectionString = confgiService.get<string>('DATABASE_URL')
        const adapter = new PrismaPg({ connectionString })
        super({ adapter })
    }

    async onModuleInit() {
        await this.$connect();
        console.log("Database connected successfully")
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log("Database disconnected");
    }
}
