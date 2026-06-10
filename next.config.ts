import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Guard against oversized form submissions (default is 1 MB)
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'upload.wikimedia.org' },
    ],
  },
};

export default nextConfig;
