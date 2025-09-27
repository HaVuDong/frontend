"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Header from "@/components/site/layout/Header"
import Carousel from "@/components/site/layout/Carousel"

export default function SiteLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Tránh lỗi hydration khi dùng window/localStorage

  // Những đường dẫn không cần hiển thị Carousel
  const hideCarouselRoutes = ["/login", "/register", "/site/auth/login", "/site/auth/register","/site/about","/site/contact"]
  const hideCarousel = hideCarouselRoutes.includes(pathname)

  return (
    <>
      <Header />
      {!hideCarousel && <Carousel />}
      <main>{children}</main>
    </>
  )
}
