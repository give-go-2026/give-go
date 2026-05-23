import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import { env } from '@/lib/env';
import * as schema from './schema';

if (process.env.NEON_LOCAL === 'true') {
  neonConfig.fetchEndpoint = 'http://localhost:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema, casing: 'snake_case' });
