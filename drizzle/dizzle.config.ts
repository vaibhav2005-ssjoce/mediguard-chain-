// drizzle/schema.ts
import { config } from 'dotenv';
config();

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pglite',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: 'postgresql'
});