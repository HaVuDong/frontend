"use client";
import { useRouter, usePathname } from "next/navigation";

export default function AuthRequiredModal({ show, onClose }) {
  const router = useRouter();
  const pathname = usePathname();

  if (!show) return null;

  const goLogin = () => {
    onClose();
    router.push(`/site/auth/login?redirect=${encodeURIComponent(pathname)}`);
  };

  const goRegister = () => {
    onClose();
    router.push(`/site/auth/register?redirect=${encodeURIComponent(pathname)}`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[99999]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[360px] text-center animate-fadeIn">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">⚠️ Bạn cần đăng nhập</h2>
        <p className="text-sm text-gray-600 mb-4">
          Vui lòng đăng nhập hoặc đăng ký để tiếp tục.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={goLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </button>
          <button
            onClick={goRegister}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            Đăng ký
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
