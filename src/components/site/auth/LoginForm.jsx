// src/components/site/auth/LoginForm.jsx
"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { login, me } from "@/services/authService";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";


const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    remember: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const { identifier, password, remember } = formData;
    const errors = [];
    // Kiểm tra trường bắt buộc
    if (!identifier || !password) {
      errors.push('Vui lòng nhập đầy đủ thông tin');
    }
    // Trả về tất cả lỗi (nếu có)
    return errors.length > 0 ? errors : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error.join('.'));
    }
    else
      try {
        let data = await login(formData.identifier, formData.password);
        const { jwt, user } = data;
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("user", JSON.stringify(user));
        const userInfo = await me();
        localStorage.setItem("role", userInfo.role.name);
        // Lưu role vào cookie
        document.cookie = `role=${userInfo.role.name}; path=/;`;

        if (userInfo.role.name == 'admin-web')
          window.location.href = '/admin'
        else if (userInfo.role.name == 'Authenticated')
          window.location.href = '/site'

      } catch (err) {
        console.log('Error:', err)
        toast.error(err.message || 'Đăng nhập thất bại');
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-500 p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gradient-to-br from-amber-300 to-amber-500 flex flex-col justify-center items-center text-white p-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Hà Vũ Đông</h1>
            <p className="text-lg md:text-xl font-medium">Chào mừng bạn quay lại</p>
          </div>
          <div className="p-8 bg-gradient-to-br to-blue-500 from-red-500">
            <ToastContainer />
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Identifier</label>
                <input
                  type="text"
                  name="identifier"
                  placeholder="Nhập email hoặc username"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full input input-bordered border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full input input-bordered border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={() => setFormData((prev) => ({ ...prev, rememberMe: !prev.rememberMe }))}
                  className="checkbox checkbox-amber-500"
                />
                <label className="text-sm text-gray-700">Ghi nhớ đăng nhập</label>
              </div>
              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-amber-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg"
              >
                Đăng nhập
              </button>
              <p className="text-sm text-center text-gray-600 mt-4">
                Chưa có tài khoản?{" "}
                <a href="/register" className="text-amber-600 font-semibold hover:underline">
                  Đăng ký ngay
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
