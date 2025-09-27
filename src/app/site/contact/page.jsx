import React from "react";

export const metadata = {
  title: "Liên hệ | HAVUDONG",
  description: "Thông tin liên hệ với thương hiệu HAVUDONG.",
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-br from-green-200 to-green-500 min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-green-800 mb-6 border-b pb-2 border-green-300">
          Liên Hệ Sân Bóng NĐ
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Thông tin liên hệ */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thông tin</h2>
            <p className="text-gray-700 mb-2">
              📍 Địa chỉ: 123 Đường Tự Nhiên, Quận Xanh, TP. Hạnh Phúc
            </p>
            <p className="text-gray-700 mb-2">📞 Điện thoại: 0909 123 456</p>
            <p className="text-gray-700 mb-2">✉️ Email: contact@sanbongnd.vn</p>
            <p className="text-gray-700">🌐 Website: www.sanbongnd.vn</p>
          </div>

          <form className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Góp ý</h2>
            <input
              type="Name"
              placeholder="Họ và tên"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="Thông tin trận bóng"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea
              placeholder="Nội dung tin nhắn"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
