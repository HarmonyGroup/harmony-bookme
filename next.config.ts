import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // Allow images from all domains
      },
      {
                protocol: 'https',
                hostname: 'harmony-bookme.s3.eu-north-1.amazonaws.com'
            },
            {
                protocol: 'https',
                hostname: 'harmony-bookme.s3.amazonaws.com'
            }
    ],
  },

};

export default nextConfig;
