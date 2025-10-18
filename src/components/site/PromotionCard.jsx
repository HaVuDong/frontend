"use client";
import { useState } from "react";

export default function PromotionsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const promotions = [
    {
      id: 1,
      badge: "Ưu Đãi Đặc Biệt",
      title: "Giảm 20% Buổi Sáng",
      icon: "🏃",
      discount: "20%",
      description: "Giảm 20% buổi sáng",
      time: "06:00 - 09:00",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      id: 2,
      badge: "Ưu Đãi Đặc Biệt",
      title: "Combo Sân + Đồng Phục",
      icon: "👕",
      discount: "30%",
      description: "Combo sân + đồng phục",
      time: "Đang áp dụng",
      gradient: "from-blue-500 to-purple-500",
      bgGradient: "from-blue-50 to-purple-50",
    },
    {
      id: 3,
      badge: "Ưu Đãi Đặc Biệt",
      title: "Miễn Phí Nước Suối",
      icon: "💧",
      discount: "FREE",
      description: "Miễn phí nước suối",
      time: "Đặt trước 3 ngày",
      gradient: "from-green-500 to-teal-500",
      bgGradient: "from-green-50 to-teal-50",
    },
    {
      id: 4,
      badge: "Ưu Đãi Đặc Biệt",
      title: "Giảm 25% Cuối Tuần",
      icon: "🎉",
      discount: "25%",
      description: "Giảm 25% thứ 7, CN",
      time: "Thứ 7 - Chủ nhật",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      id: 5,
      badge: "Ưu Đãi Đặc Biệt",
      title: "Tích Điểm Đổi Quà",
      icon: "🎁",
      discount: "x2",
      description: "Tích điểm nhân đôi",
      time: "Đặt trước 1 tuần",
      gradient: "from-yellow-500 to-amber-500",
      bgGradient: "from-yellow-50 to-amber-50",
    },
  ];

  const totalSlides = promotions.length;
  const visibleCards = 3;
  const maxIndex = totalSlides - visibleCards;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-12 bg-gradient-to-b from-orange-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
            Chương Trình Ưu Đãi
          </h2>
          <p className="text-gray-600 text-sm">
            Nhận ngay các ưu đãi đặc biệt khi đặt sân hôm nay
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 ${
              currentIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white hover:scale-110"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                width: `${(totalSlides / visibleCards) * 100}%`,
              }}
            >
              {promotions.map((promo) => (
                <div key={promo.id} className="w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
                    <div className="p-6 pt-10 bg-gradient-to-br from-white to-gray-50 text-center">
                      <div className="relative inline-block mb-4">
                        <div
                          className={`w-24 h-24 bg-gradient-to-br ${promo.gradient} rounded-3xl flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-5xl">{promo.icon}</span>
                        </div>
                        <div
                          className={`absolute -top-2 -right-2 bg-gradient-to-br ${promo.gradient} text-white text-sm font-black px-2 py-1 rounded-lg shadow-md`}
                        >
                          {promo.discount}
                        </div>
                      </div>

                      <h4 className="text-xl font-black text-gray-900 mb-2">{promo.title}</h4>
                      <p className="text-sm text-gray-700 font-semibold mb-1">{promo.description}</p>
                      <p className="text-xs text-gray-500 font-semibold mb-4">{promo.time}</p>

                      <button
                        className={`w-full bg-gradient-to-r ${promo.gradient} text-white text-sm font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all`}
                      >
                        Nhận ưu đãi
                      </button>
                    </div>
                    <div className={`h-2 bg-gradient-to-r ${promo.gradient}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-300 ${
              currentIndex >= maxIndex
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white hover:scale-110"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-8 bg-gradient-to-r from-orange-500 to-red-500"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
