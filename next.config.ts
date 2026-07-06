import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      {
        source: "/menu",
        destination: "/en/menu",
        permanent: false,
      },
      {
        source: "/privacy-policy",
        destination: "/en/privacy-policy",
        permanent: false,
      },
      {
        source: "/thank-you",
        destination: "/en/thank-you",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
