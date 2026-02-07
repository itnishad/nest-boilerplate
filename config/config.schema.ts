import { z } from 'zod';

const envSchema = z.object({
    appName: z.string().default('MyApp'),
    port: z.coerce.number().default(8000),
    DATABASE_URL: z.string(),
    security: z.object({
        jwtSecret: z.string().default('your_jwt_secret'),
        saltRounds: z.coerce.number().default(10),
    }),
});

export default envSchema;