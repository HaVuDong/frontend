"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert(`Đã đăng ký nhận tin với email: ${email}`);
    setEmail("");
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-xl transform hover:rotate-12 transition-transform">
                  <span className="text-2xl">⚽</span>
                </div>
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  Sân Bóng NĐ
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Hệ thống sân bóng đá chuyên nghiệp hàng đầu tại TP.HCM với cơ sở
                vật chất hiện đại và dịch vụ tốt nhất.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: "facebook", color: "from-blue-600 to-blue-400" },
                  { icon: "instagram", color: "from-pink-600 to-purple-400" },
                  { icon: "youtube", color: "from-red-600 to-red-400" },
                  { icon: "tiktok", color: "from-gray-800 to-gray-600" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-lg flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-lg`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-lg font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Liên Kết Nhanh
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Trang chủ", href: "/" },
                  { name: "Đặt sân", href: "/site/fields" },
                  { name: "Giải đấu", href: "/tournaments" },
                  { name: "Khuyến mãi", href: "/promotions" },
                  { name: "Liên hệ", href: "/contact" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="text-lg font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                Liên Hệ
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Địa chỉ</p>
                    <p className="text-white font-semibold text-sm">
                      123 Đình Phong Phú
                      <br />
                      Thủ Đức - TP.HCM
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Hotline</p>
                    <a
                      href="tel:0999123456"
                      className="text-white font-bold text-lg hover:text-green-400 transition-colors"
                    >
                      0999 123 456
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Email</p>
                    <a
                      href="mailto:contact@sanbongnd.com"
                      className="text-white font-semibold text-sm hover:text-purple-400 transition-colors"
                    >
                      contact@sanbongnd.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Nhận Tin Khuyến Mãi
              </h4>
              <p className="text-gray-300 text-sm mb-4">
                Đăng ký để nhận thông tin ưu đãi mới nhất
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của bạn"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity -z-10"></div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Đăng ký ngay
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </form>

              {/* Trust badges */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Bảo mật thông tin 100%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Uy tín 5 sao</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-1 rounded-full text-xs font-semibold">
                ⚽ Sân Bóng Đá Chuyên Nghiệp ⚽
              </span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; 2025{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  Sân Bóng Đá NĐ
                </span>
                . All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Made with ❤️ in Ho Chi Minh City
              </p>
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xs font-semibold">
                Thanh toán:
              </span>
              <div className="flex gap-2">
                {["VISA", "MOMO", "VNPAY", "ZALOPAY"].map((method, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/20 transition-all hover:scale-105 cursor-pointer border border-white/20"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: "🏆", label: "Giải đấu chuyên nghiệp" },
                { icon: "⚡", label: "Đặt sân nhanh chóng" },
                { icon: "💯", label: "Cam kết chất lượng" },
                { icon: "🎁", label: "Ưu đãi hấp dẫn" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="text-3xl mb-2 group-hover:animate-bounce">
                    {item.icon}
                  </div>
                  <p className="text-gray-300 text-xs font-semibold">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="relative h-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
          <svg
            className="absolute top-0 w-full h-20 text-gray-900"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-8 text-white/80">
              <a
                href="#"
                className="hover:text-white transition-colors text-xs font-semibold hover:scale-110 transform duration-300"
              >
                Chính sách
              </a>
              <span className="text-white/40">•</span>
              <a
                href="#"
                className="hover:text-white transition-colors text-xs font-semibold hover:scale-110 transform duration-300"
              >
                Điều khoản
              </a>
              <span className="text-white/40">•</span>
              <a
                href="#"
                className="hover:text-white transition-colors text-xs font-semibold hover:scale-110 transform duration-300"
              >
                Bảo mật
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-24 right-8 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
      >
        <svg
          className="w-6 h-6 text-white group-hover:-translate-y-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
}

