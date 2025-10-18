"use client";
import { useState } from "react";

export default function TournamentCard({ tournament }) {
  const [isHovered, setIsHovered] = useState(false);

  const isUpcoming = tournament.status !== "Đã diễn ra";

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500 animate-gradient"></div>

      <div className="relative h-full bg-gradient-to-br from-white to-blue-50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

        <div className="relative p-8">
          {/* Trophy icon with animation */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 00-1.5 1.5v.5h-9v-.5A1.5 1.5 0 005.5 10H5a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5a1.5 1.5 0 013 0zm-8 5.5a1 1 0 011-1h1v1a3 3 0 003 3v1a1 1 0 01-1 1H4a1 1 0 01-1-1V9zm16 0v4a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1a3 3 0 003-3V8h1a1 1 0 011 1z" />
                </svg>
              </div>
              {/* Pulse rings */}
              {isUpcoming && (
                <>
                  <span className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping opacity-75"></span>
                  <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping animation-delay-500 opacity-50"></span>
                </>
              )}
            </div>
          </div>

          {/* Tournament title */}
          <h3 className="text-2xl font-black text-gray-800 mb-4 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            {tournament.title}
          </h3>

          {/* Date info */}
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-inner">
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">{tournament.date}</span>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-105 transition-all duration-300 ${
                isUpcoming
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse-slow"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
              }`}
            >
              {isUpcoming ? (
                <>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  Sắp diễn ra
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đã diễn ra
                </>
              )}
            </span>
          </div>

          {/* Additional info on hover */}
          <div
            className={`mt-6 pt-6 border-t border-gray-200 transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3">
                <div className="text-2xl font-black text-blue-600">32</div>
                <div className="text-xs text-gray-600 font-medium">Đội tham gia</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3">
                <div className="text-2xl font-black text-orange-600">50M</div>
                <div className="text-xs text-gray-600 font-medium">Giải thưởng</div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          {isUpcoming && (
            <div
              className={`mt-6 transition-all duration-500 ${
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                Đăng ký ngay
                <svg
                  className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
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
            </div>
          )}
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-tr-full"></div>
      </div>
    </div>
  );
}
