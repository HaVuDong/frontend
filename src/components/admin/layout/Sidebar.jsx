import React from 'react';
import Link from 'next/link';
import {
  FaHome,
  FaFutbol,
  FaCalendarAlt,
  FaFirstOrder,
  FaRegUser,
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <aside className="p-4 bg-green-600 rounded-r-2xl shadow-xl w-72 text-yellow-100">
      <ul className="space-y-4 text-base font-medium">
        {/* Dashboard */}
        <li>
          <Link
            href="/admin"
            className="text-white font-bold flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-800 transition"
          >
            <FaHome /> Dashboard
          </Link>
        </li>

        {/* Quản lý sân bóng */}
        <li>
          <details className="group" open>
            <summary className="flex text-white font-bold items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-800">
              <FaFutbol /> Quản lý sân bóng
            </summary>
            <ul className="pl-8 mt-1 space-y-1 text-sm">
              <li>
                <Link
                  href="/admin/fields"
                  className="block text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Danh sách sân
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/fields/add"
                  className="block text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Thêm sân
                </Link>
              </li>
            </ul>
          </details>
        </li>

        {/* Quản lý lịch đặt sân */}
        <li>
          <details className="group" open>
            <summary className="flex text-white font-bold items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-800">
              <FaCalendarAlt /> Quản lý lịch đặt sân
            </summary>
            <ul className="pl-8 mt-1 space-y-1 text-sm">
              <li>
                <Link
                  href="/admin/bookings"
                  className="block text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Danh sách đặt sân
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/bookings/add"
                  className="block text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Chỉnh sửa lịch đặt
                </Link>
              </li>
            </ul>
          </details>
        </li>
        
        {/* Quản lý người dùng */}
        <li>
          <details className="group" open>
            <summary className="flex text-white font-bold items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-800">
              <FaRegUser /> Quản lý người dùng
            </summary>
            <ul className="pl-8 mt-1 space-y-1 text-sm">
              <li>
                <Link
                  href="/admin/users"
                  className="block text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Danh sách người dùng
                </Link>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
