import { z } from 'zod';
import 'dotenv/config';

interface AppConfig {
    appName: string,
    port: number,
    DATABASE_URL: string,
    security: {
        jwtSecret: string,
        saltRounds: number,
    }
}

const envSchema = z.object({
    appName: z.string(),
    port: z.coerce.number(),
    DATABASE_URL: z.string(),
    security: z.object({
        jwtSecret: z.string(),
        saltRounds: z.coerce.number(),
    }),
});

export default (): Record<string, unknown> => {
    const config: AppConfig = {
    appName: 'MyApp',
    port: parseInt(process.env.PORT || '3000'),
    DATABASE_URL: process.env.DATABASE_URL || '',
    security: {
        jwtSecret: process.env.JWT_SECRECT || 'your_jwt_secret',
        saltRounds: parseInt(process.env.SALTROUND || '10')
    }
}
    return envSchema.parse(config)
};