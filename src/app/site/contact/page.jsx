"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Footer from "@/components/site/layout/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("✅ Gửi thông tin thành công! Chúng tôi sẽ liên hệ bạn sớm.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Địa chỉ",
      content: "123 Đường Tự Nhiên, Quận Xanh, TP. Hạnh Phúc",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "📞",
      title: "Điện thoại",
      content: "0909 123 456",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "✉️",
      title: "Email",
      content: "contact@sanbongnd.vn",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "🌐",
      title: "Website",
      content: "www.sanbongnd.vn",
      color: "from-orange-500 to-amber-500",
    },
  ];

  const socialLinks = [
    { icon: "📘", name: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
    { icon: "📷", name: "Instagram", color: "bg-pink-600 hover:bg-pink-700" },
    { icon: "🐦", name: "Twitter", color: "bg-sky-500 hover:bg-sky-600" },
    { icon: "📺", name: "YouTube", color: "bg-red-600 hover:bg-red-700" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fadeInDown">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-3xl">📞</span>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                  Liên Hệ Với Chúng Tôi
                </h1>
                <p className="text-sm text-gray-600 font-semibold">
                  Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group animate-fadeInUp"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 hover:-translate-y-2 border-2 border-transparent hover:border-green-400">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}
                  >
                    <span className="text-3xl">{info.icon}</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-800 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-semibold break-words">
                    {info.content}
                  </p>
                  <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mt-4 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="animate-fadeInLeft">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-100">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 px-8 py-6">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <span className="text-3xl">✍️</span>
                    Gửi Tin Nhắn Cho Chúng Tôi
                  </h2>
                  <p className="text-white/90 text-sm font-semibold mt-2">
                    Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất
                  </p>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {/* Name Input */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      Họ và tên
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên của bạn"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 font-semibold text-gray-700 placeholder:text-gray-400 group-hover:border-green-300"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">✉️</span>
                        Email
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 font-semibold text-gray-700 placeholder:text-gray-400 group-hover:border-green-300"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0909 123 456"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 font-semibold text-gray-700 placeholder:text-gray-400 group-hover:border-green-300"
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">📋</span>
                      Chủ đề
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Vấn đề bạn muốn trao đổi"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 font-semibold text-gray-700 placeholder:text-gray-400 group-hover:border-green-300"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      Nội dung tin nhắn
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Nhập nội dung chi tiết..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 font-semibold text-gray-700 placeholder:text-gray-400 resize-none group-hover:border-green-300"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-2xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🚀</span>
                        <span>Gửi Tin Nhắn</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Map & Social Section */}
            <div className="space-y-8 animate-fadeInRight">
              {/* Map */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-100">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-6">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <span className="text-3xl">🗺️</span>
                    Vị Trí Của Chúng Tôi
                  </h2>
                </div>
                <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500642937!2d106.66408931533417!3d10.786834192314586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed23c80767d%3A0x5a981a5efee9fd7d!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaG9hIGjhu41jIFThu7Egbmhpw6puIC0gxJDhuqFpIGjhu41jIFF14buRYyBnaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-100">
                <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl">🌟</span>
                  Kết Nối Với Chúng Tôi
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <button
                      key={index}
                      className={`${social.color} text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 group`}
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                        {social.icon}
                      </span>
                      <span>{social.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-100">
                <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl">⏰</span>
                  Giờ Làm Việc
                </h2>
                <div className="space-y-4">
                  {[
                    { day: "Thứ 2 - Thứ 6", time: "06:00 - 23:00", color: "from-green-500 to-emerald-500" },
                    { day: "Thứ 7 - Chủ Nhật", time: "05:00 - 24:00", color: "from-blue-500 to-indigo-500" },
                    { day: "Ngày Lễ", time: "05:00 - 24:00", color: "from-purple-500 to-pink-500" },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl hover:shadow-lg transition-all duration-300 group"
                    >
                      <span className="font-bold text-gray-800 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${schedule.color} group-hover:scale-150 transition-transform duration-300`}></span>
                        {schedule.day}
                      </span>
                      <span className="font-black text-green-600">{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-center animate-fadeInUp">
            <h3 className="text-3xl font-black text-white mb-4">
              🎉 Đặt Sân Ngay Hôm Nay!
            </h3>
            <p className="text-white/90 text-lg font-semibold mb-6">
              Trải nghiệm sân bóng chất lượng cao với giá cả hợp lý
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              📞 Liên Hệ Ngay: 0909 123 456
            </button>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-fadeInDown {
            animation: fadeInDown 0.8s ease-out;
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
          }
          .animate-fadeInLeft {
            animation: fadeInLeft 0.8s ease-out;
          }
          .animate-fadeInRight {
            animation: fadeInRight 0.8s ease-out;
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}
