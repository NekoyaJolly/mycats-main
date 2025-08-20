/** @type {import('next').NextConfig} */
const nextConfig = {
  // 環境変数からAPIのURLを取得
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004/api/v1',
  },
  // その他の設定
  reactStrictMode: true,
};

export default nextConfig;
