import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quản Lý Sân Bóng",
  description: "App quản lý sân bóng chuyên nghiệp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" data-theme="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable ?? ""} ${geistMono.variable ?? ""} relative min-h-screen bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
