import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "esnuavbpzjqdeiagggzd.supabase.co",
      },
    ],
  },
};

export default nextConfig;