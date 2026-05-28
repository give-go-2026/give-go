import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(',') ?? [],
};

export default nextConfig;
