"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Header from "@/components/site/layout/Header"

export default function SiteLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Tránh lỗi hydration khi dùng window/localStorage

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
