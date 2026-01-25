import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/core/:path*',
        destination: 'http://localhost:1011/api/core/:path*',
      },
    ];
  },
};

export default nextConfig;
