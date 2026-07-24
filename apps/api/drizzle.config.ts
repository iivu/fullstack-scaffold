import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas',
  dialect: 'mysql',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
