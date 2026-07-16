import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [68, 70, 72],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31_536_000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml; charset=utf-8",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/menu",
        destination: "/en/menu",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/en/privacy-policy",
        permanent: true,
      },
      {
        source: "/thank-you",
        destination: "/en/thank-you",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
