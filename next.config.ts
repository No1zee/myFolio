import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://vercel.live; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data: https://r2cdn.perplexity.ai; connect-src 'self' https: wss://*.vercel.live;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
