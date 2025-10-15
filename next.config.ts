import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "go2njemacka.de",
      },
      {
        protocol: "https",
        hostname: "www.go2njemacka.de",
      },
    ],
  },
};

export default nextConfig;
