"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { register } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧠 Hàm kiểm tra username hợp lệ
  const isValidUsername = (username) => {
    const regex = /^[a-z0-9]+$/;
    return regex.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, phone } = formData;

    if (!username) {
      toast.error("Vui lòng nhập username!");
      return;
    }

    // ❌ Kiểm tra chữ hoa
    if (/[A-ZÀ-Ỹ]/.test(username)) {
      toast.error("Vui lòng nhập username chỉ chứa chữ thường!");
      return;
    }

    // ❌ Kiểm tra dấu hoặc khoảng trắng
    if (!isValidUsername(username)) {
      toast.error("Username chỉ được chứa chữ thường không dấu và không khoảng trắng!");
      return;
    }

    if (!email || !password || !phone) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(username, email, password, phone);

      if (res?.success) {
        toast.success("Đăng ký thành công!");
        setTimeout(() => router.push("/site/auth/login"), 1500);
      } else {
        toast.error(res.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Register Card */}
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* --- LEFT SIDE --- */}
          <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex flex-col justify-center items-center text-white p-12 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8 inline-block">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 hover:scale-110 transition-all duration-300">
                  <span className="text-6xl">⚽</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
                SportField
              </h1>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-white to-transparent mb-4 rounded-full"></div>
              <p className="text-xl md:text-2xl font-semibold mb-6">
                Tạo tài khoản mới
              </p>
              <p className="text-white/90 text-sm max-w-md">
                Tham gia cộng đồng đặt sân bóng lớn nhất Việt Nam
              </p>

              {/* Benefits */}
              <div className="mt-8 space-y-3">
                {[
                  { icon: "⚡", text: "Đặt sân chỉ với 3 bước" },
                  { icon: "🎁", text: "Ưu đãi dành cho thành viên mới" },
                  { icon: "📱", text: "Quản lý lịch đặt dễ dàng" },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                    <span className="text-2xl">{benefit.icon}</span>
                    <span className="text-sm font-semibold">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE --- */}
          <div className="p-10 lg:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Đăng ký tài khoản 🚀
              </h2>
              <p className="text-gray-600 font-medium">
                Điền thông tin để bắt đầu
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Tên đăng nhập
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="dong123 (chữ thường, không dấu)"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 font-medium"
                  />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Chỉ chữ thường (a-z) và số (0-9), không khoảng trắng
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Số điện thoại
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-500 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full py-4 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Đang đăng ký...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Đăng ký ngay
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-semibold">hoặc</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/site/auth/login"
                    className="font-bold text-green-600 hover:text-teal-600 transition-colors inline-flex items-center gap-1 group"
                  >
                    Đăng nhập ngay
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
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
    </div>
  );
};

export default RegisterForm;