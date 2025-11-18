"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800" suppressHydrationWarning>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" suppressHydrationWarning>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" suppressHydrationWarning></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" suppressHydrationWarning></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-teal-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" suppressHydrationWarning></div>
      </div>

      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10" suppressHydrationWarning>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} suppressHydrationWarning></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
              </span>
              <span className="text-white text-sm font-semibold">⚽ Sân Bóng Đá Chuyên Nghiệp</span>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
                Sân Bóng Đá
                <span className="block text-yellow-300 mt-2">NĐ</span>
              </h1>
              <div className="h-1.5 w-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {[
                { icon: "🏟️", text: "Cho thuê sân bóng đá 5 và 7 người" },
                { icon: "👨‍⚖️", text: "Trọng tài chuyên nghiệp" },
                { icon: "⭐", text: "Dịch vụ đầy đủ" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="text-3xl">{item.icon}</div>
                  <span className="text-white font-semibold text-lg">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Địa chỉ</p>
                <p className="text-white font-bold text-lg">123 Đình Phong Phú - Thủ Đức - TP Hồ Chí Minh</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/site/fields"
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                  Đặt Sân Ngay
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <a
                href="tel:0999123456"
                className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white hover:text-green-700 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                0999 123 456
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN - Stats Cards */}
          <div className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "500+", label: "Khách Hàng", icon: "👥", gradient: "from-blue-500 to-cyan-500" },
                { number: "10+", label: "Sân Bóng", icon: "⚽", gradient: "from-green-500 to-emerald-500" },
                { number: "24/7", label: "Hỗ Trợ", icon: "🎧", gradient: "from-purple-500 to-pink-500" },
                { number: "100%", label: "Hài Lòng", icon: "⭐", gradient: "from-yellow-500 to-orange-500" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-rotate-2"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur transition duration-500 rounded-2xl" style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>
                  <div className="relative">
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-white/90 font-semibold text-sm">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Highlight Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-4xl">🎁</span>
                </div>
                <div>
                  <h3 className="text-white font-black text-xl mb-2">Ưu Đãi Đặc Biệt!</h3>
                  <p className="text-white/90 font-semibold mb-3">Giảm 30% cho khách hàng mới</p>
                  <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-orange-50 transition-all hover:scale-105 shadow-lg">
                    Nhận ngay →
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "✓", text: "Chất lượng" },
                { icon: "⚡", text: "Nhanh chóng" },
                { icon: "💯", text: "Uy tín" },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center hover:bg-white/20 transition-all hover:scale-105"
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-white text-xs font-semibold">{badge.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
