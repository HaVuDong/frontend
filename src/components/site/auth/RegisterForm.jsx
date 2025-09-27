"use client"
import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from '@/services/authService';
import { useRouter } from 'next/navigation';


const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const { username, email, password, confirmPassword, termsAccepted } = formData;
    const errors = [];

    if (!username || !email || !password || !confirmPassword) {
      errors.push('Vui lòng nhập đầy đủ thông tin');
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push('Email không hợp lệ');
    }

    if (password.length < 6) {
      errors.push('Mật khẩu phải ít nhất 6 ký tự');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
    if (!passwordRegex.test(password)) {
      errors.push('Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt');
    }

    if (password !== confirmPassword) {
      errors.push('Mật khẩu không khớp');
    }

    if (!termsAccepted) {
      errors.push('Bạn phải đồng ý với điều khoản');
    }

    return errors.length > 0 ? errors : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error.join('. '));
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      toast.success('Đăng ký thành công!');
      router.push('/site/auth/login');
    } catch (err) {
      toast.error(err.message || 'Đăng ký thất bại');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side */}
            <div className="bg-amber-500 flex flex-col justify-center items-center text-white p-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Hà Vũ Đông</h1>
              <p className="text-lg md:text-xl font-medium">Đăng ký tài khoản mới</p>
            </div>

            {/* Right Side */}
            <div className="p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Họ và tên</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="username"
                    placeholder="Nhập họ và tên"
                    className="w-full input input-bordered border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                    value={formData.username}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    placeholder="Nhập email"
                    className="w-full input input-bordered border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                    value={formData.email}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mật khẩu</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full input input-bordered border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                    value={formData.password}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Xác nhận mật khẩu</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    className="w-full input input-bordered border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                    value={formData.confirmPassword}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={!!formData.termsAccepted}
                    onChange={handleChange}
                    className="checkbox checkbox-amber-500 mt-1"
                  />
                  <label className="text-sm text-gray-700">
                    Tôi đồng ý với{" "}
                    <a href="/terms" className="text-amber-600 font-semibold hover:underline">
                      điều khoản sử dụng
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!formData.termsAccepted}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Đăng ký
                </button>

                <p className="text-sm text-center text-gray-600 mt-4">
                  Đã có tài khoản?{" "}
                  <a href="/site/auth/login" className="text-amber-600 font-semibold hover:underline">
                    Đăng nhập
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
