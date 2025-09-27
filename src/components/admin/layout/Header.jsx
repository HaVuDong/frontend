"use client"
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'role=; path=/;';
    setUser(null);
    router.push('/site/auth/login');
  };

  return (
    <header className="navbar bg-gradient-to-br from-blue-300 to-yellow-300 text-white px-6 shadow-md">
      <div className="navbar-start flex items-center gap-3">
        <span className="text-xl font-bold">Admin Dashboard</span>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost bg-white text-black avatar">
              <div className="w-10 h-10 flex items-center justify-center font-bold">
                {user.username}
              </div>
            </div>
            <ul className="menu dropdown-content mt-3 p-2 shadow bg-white text-black rounded-box w-52">
              <li><Link href="/site/auth/profile">Profile</Link></li>
              <li><Link href="/site/auth/settings">Settings</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link href="/site/auth/login" className="btn btn-sm bg-white text-[#F59E0B] font-semibold">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
