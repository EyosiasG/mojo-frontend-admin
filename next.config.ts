import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://mojoapi.grandafricamarket.com/:path*", // Proxy API requests
      },
    ];
  },
};

export default nextConfig;
