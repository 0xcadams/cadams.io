import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/images/:name*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000",
          },
        ],
      },
      {
        source: "/images/fire-1.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000, s-maxage=31536000",
          },
        ],
      },
    ];
  },

  rewrites: async () => {
    return [
      {
        source: "/api/data/:match*",
        destination: "https://cadams.io/_vercel/insights/:match*",
      },
    ];
  },
};

export default nextConfig;
