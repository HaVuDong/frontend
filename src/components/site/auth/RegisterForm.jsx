"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { register } from "@/services/authService";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await register(
        formData.username,
        formData.email,
        formData.password
      );

      if (res?.success) {
        toast.success("Đăng ký thành công!");
        router.push("/site/auth/login");
      } else {
        toast.error(res.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-200 p-4">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-amber-500 flex flex-col justify-center items-center text-white p-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Hà Vũ Đông</h1>
            <p className="text-lg md:text-xl font-medium">
              Tạo tài khoản mới
            </p>
          </div>

          <div className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Tên đăng nhập
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập username"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Mật khẩu
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg"
              >
                Đăng ký
              </button>

              <p className="text-sm text-center text-gray-600 mt-4">
                Đã có tài khoản?{" "}
                <a
                  href="/site/auth/login"
                  className="text-amber-600 font-semibold hover:underline"
                >
                  Đăng nhập
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
