"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    document.cookie = "role=; path=/;";
    router.push("/site/auth/login");
  };

  return (
    <div className="navbar bg-gradient-to-br to-white-500 from-green-500 text-gray-800 font-sans rounded px-4">
      <div className="navbar-center hidden lg:flex flex-1">
        <ul className="menu menu-horizontal px-1 text-xl font-semibold">
          <li><Link href="/site">Trang chủ</Link></li>
          <li><Link href="/site/about">Đặt sân</Link></li>
          <li><Link href="/site/profile">Thông tin</Link></li>
          <li><Link href="/site/contact">Góp Ý</Link></li>
        </ul>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {!user ? (
          <Link
            href="/site/auth/login"
            className="px-4 py-2 rounded-xl bg-white text-green-600 font-semibold border hover:bg-green-50"
          >
            Đăng nhập
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium">{user.username || "User"}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
