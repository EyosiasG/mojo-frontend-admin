import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['ui-avatars.com', 'mojoapi.grandafricamarket.com', 'mojoapi.crosslinkglobaltravel.com', 'toppng.com', 'www.pngitem.com'], // Add the domain here
  },
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
        destination: "https://mojoapi.crosslinkglobaltravel.com/:path*", // Proxy API requests
      },
    ];
  },
};


export default nextConfig;

