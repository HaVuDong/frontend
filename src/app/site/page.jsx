"use client";
import { useEffect, useState } from "react";
import HeroSection from "@/components/site/HeroSection";
import ImageGallery from "@/components/site/ImageGallery";
import TournamentCard from "@/components/site/TournamentCard";
import PromotionCard from "@/components/site/PromotionCard";
import Footer from "@/components/site/layout/Footer";
import axiosClient from "@/utils/axiosClient";

export default function Home() {
  const [tournaments, setTournaments] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("🌐 API Base URL:", process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    Promise.all([
      axiosClient.get("/tournaments").then((res) => setTournaments(res.data || [])),
      axiosClient.get("/promotions").then((res) => setPromotions(res.data || []))
    ]).finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 overflow-hidden">
      <HeroSection />
      <ImageGallery />

      {/* Giải đấu với hiệu ứng fade-in */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10">
          <div className="text-center mb-12 animate-fade-in-down">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                🏆 GIẢI ĐẤU
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mb-4 animate-gradient">
              Các Giải Đấu Hấp Dẫn
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tham gia các giải đấu chuyên nghiệp và thể hiện kỹ năng của bạn
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {tournaments.map((t, i) => (
                <div
                  key={i}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <TournamentCard tournament={t} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Khuyến mãi với hiệu ứng shine */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.3),transparent_50%)] animate-pulse-slow"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-12 animate-fade-in-down">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg animate-shine">
                🎁 ƯU ĐÃI HOT
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 mb-4">
              Chương Trình Ưu Đãi
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Nhận ngay các ưu đãi đặc biệt khi đặt sân hôm nay
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-56 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-2xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {promotions.map((p, i) => (
                <div
                  key={i}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <PromotionCard promo={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
F
      <Footer />

      {/* Floating action button */}
      <a
        href="tel:0999123456"
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 z-50 animate-bounce-slow group"
      >
        <svg
          className="w-7 h-7 group-hover:rotate-12 transition-transform"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 3a1 F1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </a>
    </main>
  );
}
