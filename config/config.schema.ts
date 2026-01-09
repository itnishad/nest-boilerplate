import { z } from 'zod';

const envSchema = z.object({
    appName: z.string().default('MyApp'),
    port: z.coerce.number().default(8000),
    database: z.object({
        host: z.string().default('localhost'),
        port: z.coerce.number().default(5432),
        username: z.string().default('user'),
        password: z.string().default('password'),
        dbName: z.string().default('myapp_db'),
    }),
    security: z.object({
        jwtSecret: z.string().default('your_jwt_secret'),
        saltRounds: z.coerce.number().default(10),
    }),
});

export default envSchema;