import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  SALTROUND: z.coerce.number().default(10),
});

export type AppConfig = z.infer<typeof envSchema>;

export default (): AppConfig => {
  return envSchema.parse(process.env);
};