"use client";
import { useEffect, useState } from "react";
import HeroSection from "@/components/Site/HeroSection";
import ImageGallery from "@/components/Site/ImageGallery";
import TournamentCard from "@/components/Site/TournamentCard";
import PromotionCard from "@/components/Site/PromotionCard";
import Footer from "@/components/site/layout/Footer";
import axiosClient from "@/utils/axiosClient";

export default function Home() {
  const [tournaments, setTournaments] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    // Gọi API backend
    axiosClient.get("/tournaments").then((res) => setTournaments(res.data || []));
    axiosClient.get("/promotions").then((res) => setPromotions(res.data || []));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection />
      <ImageGallery />

      {/* Giải đấu */}
      <section className="bg-white py-12 px-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Các giải đấu
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tournaments.map((t, i) => (
            <TournamentCard key={i} tournament={t} />
          ))}
        </div>
      </section>

      {/* Khuyến mãi */}
      <section className="py-12 px-6 bg-green-50">
        <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">
          Chương trình ưu đãi
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {promotions.map((p, i) => (
            <PromotionCard key={i} promo={p} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
