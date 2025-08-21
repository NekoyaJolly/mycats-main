/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint設定
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript設定
  typescript: {
    ignoreBuildErrors: true,
  },
  // 環境変数からAPIのURLを取得
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004/api/v1',
  },
  // パフォーマンス最適化
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 画像最適化設定
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // 実験的機能
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },

  // コンパイラ最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ヘッダー設定
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
