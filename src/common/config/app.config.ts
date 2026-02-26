import { z } from 'zod';
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
    appName: z.string().default('MyApp'),
    port: z.coerce.number().default(8000),
    DATABASE_URL: z.string(),
    security: z.object({
        jwtSecret: z.string().default('your_jwt_secret'),
        saltRounds: z.coerce.number().default(10),
    }),
});

export default (): Record<string, unknown> => {
    const config: AppConfig = {
    appName: 'MyApp',
    port: parseInt(process.env.PORT || '3000'),
    DATABASE_URL: process.env.DATABASE_URL || '',
    security: {
        jwtSecret: process.env.JWT_SECRECT || '',
        saltRounds: parseInt(process.env.SALTROUND || '10')
    }
}
    return envSchema.parse(config)
};