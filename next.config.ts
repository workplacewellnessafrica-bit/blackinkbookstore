import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'archive.org',
      },
      {
        protocol: 'https',
        hostname: 'ia902205.us.archive.org',
      },
      {
        protocol: 'https',
        hostname: 'ia802205.us.archive.org',
      },
      {
         protocol: 'https',
         hostname: 'ia801509.us.archive.org',
      },
      {
         protocol: 'https',
         hostname: '*.archive.org'
      }
    ],
  },
};

export default nextConfig;
