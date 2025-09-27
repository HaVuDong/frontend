import React from 'react';
import { Twitter, Youtube, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-300 to-yellow-300 text-white w-full px-6 py-3 z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center text-black font-bold">
            Đ
          </div>
          <span className="text-sm sm:text-base">
            © {new Date().getFullYear()} Hà Vũ Đông — All rights reserved
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-yellow-300"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="hover:text-yellow-300"><Youtube className="w-5 h-5" /></a>
          <a href="#" className="hover:text-yellow-300"><Facebook className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
