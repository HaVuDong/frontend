/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend-kker.onrender.com',
        pathname: '/uploads/**', // đúng với đường dẫn ảnh của bạn
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8017',
        pathname: '/uploads/**', // để dev local vẫn hoạt động
      },
    ],
  },
};

export default nextConfig;
