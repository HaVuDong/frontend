// Sidebar.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  BarChart3,
  Shield,
  Bell,
  CreditCard,
  Box,
  ShoppingBag,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({
    fields: true,
    bookings: true,
    users: true,
    products: true,
    orders: true,
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/admin',
      badge: null,
    },
    {
      title: 'Quản lý sân bóng',
      icon: Shield,
      key: 'fields',
      submenu: [
        { title: 'Danh sách sân', href: '/admin/fields', icon: List },
        { title: 'Thêm sân mới', href: '/admin/fields/add', icon: Plus },
        { title: 'Thống kê sân', href: '/admin/fields/stats', icon: BarChart3 },
      ],
    },
    {
      title: 'Quản lý đặt sân',
      icon: Calendar,
      key: 'bookings',
      badge: 5,
      submenu: [
        { title: 'Danh sách đặt sân', href: '/admin/bookings', icon: List },
        { title: 'Lịch đặt sân', href: '/admin/bookings/calendar', icon: Calendar },
        { title: 'Thanh toán', href: '/admin/bookings/payments', icon: CreditCard },
      ],
    },
    {
      title: 'Quản lý người dùng',
      icon: Users,
      key: 'users',
      submenu: [
        { title: 'Danh sách người dùng', href: '/admin/users', icon: List },
        { title: 'Thêm người dùng', href: '/admin/users/add', icon: Plus },
        { title: 'Phân quyền', href: '/admin/users/roles', icon: Shield },
      ],
    },
    {
      title: 'Quản lý sản phẩm',
      icon: Box,
      key: 'products',
      submenu: [
        { title: 'Danh sách sản phẩm', href: '/admin/products', icon: List },
        { title: 'Thêm sản phẩm', href: '/admin/products/add', icon: Plus },
      ],
    },
    {
      title: 'Quản lý đơn hàng',
      icon: ShoppingBag,
      key: 'orders',
      badge: 3,
      submenu: [
        { title: 'Danh sách đơn hàng', href: '/admin/orders', icon: List },
        { title: 'Chờ xác nhận thanh toán', href: '/admin/orders?filter=awaiting_confirmation', icon: Bell },
        { title: 'Thống kê đơn hàng', href: '/admin/orders/stats', icon: BarChart3 },
      ],
    },
  ];

  const isActive = (href) => pathname === href;
  const isParentActive = (submenu) => submenu?.some(item => pathname === item.href);

  return (
    <aside className="relative h-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-r-3xl shadow-2xl overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Logo Section */}
        <div className="mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <span className="text-2xl font-black text-white">⚽</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Football Admin</h2>
              <p className="text-xs text-gray-300">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  // Menu with submenu
                  <div>
                    <button
                      onClick={() => toggleMenu(item.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                        isParentActive(item.submenu)
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isParentActive(item.submenu) ? 'text-white' : 'group-hover:scale-110'} transition-all duration-300`} />
                        <span className="font-bold text-sm">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                            {item.badge}
                          </span>
                        )}
                        {openMenus[item.key] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Submenu */}
                    {openMenus[item.key] && (
                      <ul className="mt-2 ml-4 space-y-1 animate-slideDown">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                                isActive(subItem.href)
                                  ? 'bg-white/20 text-white shadow-lg translate-x-2'
                                  : 'text-gray-300 hover:bg-white/10 hover:translate-x-1'
                              }`}
                            >
                              <subItem.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-semibold">{subItem.title}</span>
                              {isActive(subItem.href) && (
                                <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Single menu item
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : 'group-hover:scale-110'} transition-all duration-300`} />
                      <span className="font-bold text-sm">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
          {/* Notifications */}
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 group">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white">Thông báo</span>
            <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              3
            </span>
          </button>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 group"
          >
            <Settings className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 group-hover:rotate-90 transition-all duration-500" />
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white">Cài đặt</span>
          </Link>

          {/* User Info Card */}
          <div className="p-4 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-yellow-400/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
                Đ
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Sân Bóng NĐ</p>
                <p className="text-xs text-gray-300">Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

