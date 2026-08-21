import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep recently visited dynamic pages warm so back/forward feels instant.
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
