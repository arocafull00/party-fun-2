import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  driver: 'expo',
  dialect: 'sqlite',
} satisfies Config; 