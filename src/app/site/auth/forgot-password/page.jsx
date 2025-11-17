"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { 
  FaLock, 
  FaUser, 
  FaPhone, 
  FaEye, 
  FaEyeSlash, 
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { resetPassword } from "@/services/authService";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form states
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!username || username.trim().length < 3) {
      toast.error("Tên đăng nhập phải có ít nhất 3 ký tự");
      return false;
    }

    if (!phone || phone.trim().length < 9) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      toast.error("Số điện thoại không đúng định dạng");
      return false;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await resetPassword({
        username: username.trim().toLowerCase(),
        phone: phone.trim(),
        newPassword
      });

      if (response.success) {
        setSuccess(true);
        toast.success("Đặt lại mật khẩu thành công!");
        
        // Redirect sau 2 giây
        setTimeout(() => {
          router.push("/site/auth/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Đặt lại mật khẩu thất bại";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Thành công!</h2>
          <p className="text-gray-600 mb-6">
            Mật khẩu của bạn đã được đặt lại thành công. Đang chuyển đến trang đăng nhập...
          </p>
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-3xl text-green-600" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-8 text-white text-center relative">
          <Link
            href="/site/auth/login"
            className="absolute left-4 top-4 p-2 hover:bg-white/20 rounded-lg transition-all"
          >
            <FaArrowLeft />
          </Link>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-4xl" />
          </div>
          <h1 className="text-3xl font-black">Quên mật khẩu</h1>
          <p className="text-green-100 mt-2">Đặt lại mật khẩu của bạn</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              💡 <strong>Lưu ý:</strong> Nhập tên đăng nhập và số điện thoại đã đăng ký để đặt lại mật khẩu.
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                placeholder="0912345678"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                placeholder="Ít nhất 6 ký tự"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FaLock />
                Đặt lại mật khẩu
              </>
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center pt-4">
            <Link
              href="/site/auth/login"
              className="text-green-600 hover:text-green-700 font-medium hover:underline inline-flex items-center gap-2"
            >
              <FaArrowLeft />
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}