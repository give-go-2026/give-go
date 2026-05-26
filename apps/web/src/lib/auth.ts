import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/database';
import * as schema from '@/database/schema';
import { env } from './env';

export const auth = betterAuth({
  secret: env.AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'org',
        input: false,
      },
      registrationNumber: {
        type: 'string',
        required: false,
        input: true,
      },
      website: {
        type: 'string',
        required: false,
        input: true,
      },
      contactName: {
        type: 'string',
        required: false,
        input: true,
      },
      contactPhone: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
