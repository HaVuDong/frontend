"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { login } from "@/services/authService";
import { useSearchParams, useRouter } from "next/navigation";
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-500 p-4">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* --- LEFT --- */}
          <div className="bg-gradient-to-br from-amber-300 to-amber-500 flex flex-col justify-center items-center text-white p-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Hà Vũ Đông</h1>
            <p className="text-lg md:text-xl font-medium">Chào mừng bạn quay lại</p>
          </div>

          {/* --- RIGHT --- */}
          <div className="p-8 bg-gradient-to-br to-blue-500 from-red-500">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-white font-semibold mb-1">
                  Tài khoản hoặc Email
                </label>
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
                <label className="block text-white font-semibold mb-1">
                  Mật khẩu
                </label>
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
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="checkbox checkbox-amber-500"
                />
                <label className="text-sm text-white">Ghi nhớ đăng nhập</label>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg"
              >
                Đăng nhập
              </button>
              <p className="text-sm text-center text-white mt-4">
                Chưa có tài khoản?{" "}
                <a
                  href="/site/auth/register"
                  className="text-yellow-300 font-semibold hover:underline"
                >
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
