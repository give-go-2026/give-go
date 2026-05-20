import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DEV_ORIGINS: z.string().optional(),
    DATABASE_URL: z.string().nonempty(),
    RESEND_API_KEY: z.string().nonempty(),
  },
  client: {
    NEXT_PUBLIC_PRODUCT_NAME: z.string().default('Give&Go'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_PRODUCT_NAME: process.env.NEXT_PUBLIC_PRODUCT_NAME,
    DEV_ORIGINS: process.env.DEV_ORIGINS,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
});
