"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { login } from "@/services/authService";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const msg = searchParams.get("msg");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ⚠️ Hiển thị cảnh báo khi bị middleware chặn
  useEffect(() => {
    if (msg === "needLogin") {
      toast.info("⚠️ Bạn cần đăng nhập để tiếp tục truy cập trang này!");
    }
  }, [msg]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const { identifier, password } = formData;
    const errors = [];
    if (!identifier || !password) errors.push("Vui lòng nhập đầy đủ thông tin");
    return errors.length > 0 ? errors : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (errors) {
      toast.error(errors.join(". "));
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(formData.identifier, formData.password);
      if (res?.token) {
        // ✅ Lưu token & user
        localStorage.setItem("jwt", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("role", res.user.role);

        // ✅ Bắn sự kiện để Header tự cập nhật username
        window.dispatchEvent(new Event("storage"));

        toast.success("🎉 Đăng nhập thành công!");

        // ✅ Điều hướng sau khi đăng nhập
        setTimeout(() => {
          if (redirect) router.push(redirect);
          else if (res.user.role === "admin") router.push("/admin");
          else router.push("/site");
        }, 1000);
      } else {
        toast.error(res.message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      toast.error(err.message || "Đăng nhập thất bại!");
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

      {/* Login Card */}
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
                Đặt sân nhanh chóng
              </p>
              <p className="text-white/90 text-sm max-w-md">
                Hệ thống quản lý và đặt sân bóng hiện đại, tiện lợi và nhanh chóng
              </p>

              {/* Feature badges */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <span>⚡</span> Đặt sân nhanh
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <span>🎯</span> Quản lý dễ dàng
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <span>💳</span> Thanh toán linh hoạt
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE --- */}
          <div className="p-10 lg:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Chào mừng trở lại! 👋
              </h2>
              <p className="text-gray-600 font-medium">
                Đăng nhập để tiếp tục đặt sân
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email/Username Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Tài khoản hoặc Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Nhập email hoặc username"
                    value={formData.identifier}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
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

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-green-500 focus:ring-2 focus:ring-green-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <Link
                  href="/site/auth/forgot-password"
                  className="text-sm font-bold text-green-600 hover:text-teal-600 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
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
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Đăng nhập ngay
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

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/site/auth/register"
                    className="font-bold text-green-600 hover:text-teal-600 transition-colors inline-flex items-center gap-1 group"
                  >
                    Đăng ký ngay
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

export default LoginForm;