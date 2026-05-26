import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';
import * as schema from './schema';

const url = process.env.DATABASE_URL!;

export const db =
  process.env.NEON_LOCAL === 'true'
    ? drizzlePg(postgres(url, { ssl: false }), { schema, casing: 'snake_case' })
    : drizzleNeon({ client: neon(url), schema, casing: 'snake_case' });
