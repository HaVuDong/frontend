/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // ⚙️ Cho phép tải ảnh từ tất cả domain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ✅ Cho phép tất cả website dùng HTTPS
      },
      {
        protocol: "http",
        hostname: "**", // ✅ Cho phép luôn HTTP (trường hợp ảnh cũ không SSL)
      },
    ],
  },

  // 🧩 Tuỳ chọn: bỏ qua lỗi build do ESLint hoặc TypeScript
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
