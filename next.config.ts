import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.thesports.com", // <-- Whitelist SportScore images
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com", // <-- (Keep this if you are using DiceBear for punters)
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // <-- (Keep this for Supabase storage)
      },
    ],
  },
};

export default nextConfig;
