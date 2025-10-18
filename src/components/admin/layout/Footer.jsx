// Footer.jsx
import React from 'react';
import { Twitter, Youtube, Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: Twitter, href: '#', color: 'hover:bg-sky-500', label: 'Twitter' },
    { icon: Youtube, href: '#', color: 'hover:bg-red-600', label: 'Youtube' },
    { icon: Instagram, href: '#', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: Linkedin, href: '#', color: 'hover:bg-blue-700', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { name: 'Về chúng tôi', href: '#' },
    { name: 'Dịch vụ', href: '#' },
    { name: 'Liên hệ', href: '#' },
    { name: 'Chính sách', href: '#' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <span className="text-2xl font-black text-white">Đ</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    HÀ VŨ ĐÔNG
                  </h3>
                  <p className="text-xs text-gray-300">Admin System</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Hệ thống quản lý sân bóng chuyên nghiệp, mang đến trải nghiệm tốt nhất cho người dùng.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Made with passion</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
                Liên Kết Nhanh
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-yellow-400 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-0.5 bg-yellow-400 group-hover:w-4 transition-all duration-300"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
                Liên Hệ
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-300 group">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-300">
                    <Phone className="w-4 h-4 group-hover:text-white" />
                  </div>
                  <span>+84 123 456 789</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300 group">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-300">
                    <Mail className="w-4 h-4 group-hover:text-white" />
                  </div>
                  <span>havudong@example.com</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300 group">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-300">
                    <MapPin className="w-4 h-4 group-hover:text-white" />
                  </div>
                  <span>Hà Nội, Việt Nam</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
                Đăng Ký Nhận Tin
              </h4>
              <p className="text-sm text-gray-300 mb-4">
                Nhận thông tin cập nhật mới nhất từ chúng tôi
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:border-yellow-400 transition-all duration-300 text-sm"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>© {currentYear}</span>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                HÀ VŨ ĐÔNG
              </span>
              <span>— All rights reserved</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:-translate-y-1 group`}
                >
                  <social.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"></div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
