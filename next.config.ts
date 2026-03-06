import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to support API routes
  async headers() {
    return [
      {
        source: '/install.sh',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
