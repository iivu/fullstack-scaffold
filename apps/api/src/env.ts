import { z } from 'zod';
import 'dotenv/config';

const appEnvSchema = z.object({
  PORT: z.coerce.number().positive().default(3000),
  APP_MODE: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string(),
});

export type AppEnv = z.infer<typeof appEnvSchema>;

const parsedAppEnv = appEnvSchema.parse(Object.fromEntries(Object.keys(appEnvSchema.shape).map((key) => [key, process.env[key]])));

export const appEnv = Object.freeze(parsedAppEnv);
