"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// ✅ Import functions
import { confirmManualPayment } from "@/services/orderService";
import { getCurrentUser, me } from "@/services/authService";

function ManualPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const amount = Number(searchParams.get("amount") || 0);
  const orderId = searchParams.get("orderId");
  const buyerName = searchParams.get("name") || "Khach";
  const buyerPhone = searchParams.get("phone") || "0000000000";

  const transferNote = `DH${orderId}-${buyerName}-${buyerPhone}`;
  const BANK_CODE = "970407";
  const ACCOUNT_NO = "50977451512";

  const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferNote
  )}`;

  // ⭐ Load user khi component mount
  useEffect(() => {
    const loadUser = async () => {
      console.log("🔍 [ManualPayment] Loading user...");
      
      // Thử lấy từ localStorage trước
      let user = getCurrentUser();
      console.log("📦 [ManualPayment] User from localStorage:", user);
      
      // Nếu không có, thử gọi API
      if (!user) {
        try {
          console.log("🌐 [ManualPayment] Fetching user from API...");
          const userData = await me();
          console.log("✅ [ManualPayment] User from API:", userData);
          if (userData) {
            user = userData;
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (error) {
          console.error("❌ [ManualPayment] Cannot fetch user:", error);
        }
      }
      
      console.log("✅ [ManualPayment] Final user:", user);
      setCurrentUser(user);
    };
    
    loadUser();
  }, []);

  // ✅ Hàm xác nhận đã sửa
  const handleConfirm = async () => {
    if (!orderId) {
      toast.error("Không tìm thấy mã đơn hàng!");
      return;
    }

    try {
      setConfirming(true);

      // ⭐ Kiểm tra có jwt token không
      const token = Cookies.get("jwt");
      
      if (!token) {
        console.error("❌ No token found");
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        setTimeout(() => {
          router.push("/site/auth/login?redirect=/site/payment/manual");
        }, 1500);
        return;
      }

      // ⭐ Sử dụng currentUser từ state (hỗ trợ cả _id và id)
      const userId = currentUser?._id || currentUser?.id;
      
      if (!currentUser || !userId) {
        console.error("❌ No user found. currentUser:", currentUser);
        toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
        setTimeout(() => {
          router.push("/site/auth/login?redirect=/site/payment/manual");
        }, 1500);
        return;
      }

      console.log("✅ Confirming payment with userId:", userId);
      
      const response = await confirmManualPayment(orderId, userId);

      if (response) {
        toast.success("✅ Đã gửi xác nhận! Admin sẽ kiểm tra và xác nhận thanh toán.");
        
        setTimeout(() => {
          router.push("/site/orders");
        }, 1500);
      }

    } catch (error) {
      console.error("❌ Confirm payment error:", error);
      
      // ⭐ Xử lý lỗi 401 riêng
      if (error.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        setTimeout(() => {
          router.push("/site/auth/login");
        }, 1500);
      } else {
        toast.error(error.message || "Không thể xác nhận thanh toán!");
      }
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1b2a] py-10 px-4 flex justify-center">
      <div className="max-w-md w-full bg-[#1b263b] rounded-2xl p-6 shadow-xl">

        <h1 className="text-xl font-bold text-center text-white mb-2">
          Thanh toán chuyển khoản ngân hàng
        </h1>

        <p className="text-center text-gray-300 mb-4">
          Số tiền cần chuyển:
          <br />
          <span className="text-green-400 text-2xl font-bold">
            {amount.toLocaleString()} đ
          </span>
        </p>

        <div className="bg-gray-800 p-4 rounded-xl flex justify-center mb-4">
          <Image
            src={qrUrl}
            alt="VietQR"
            width={300}
            height={300}
            className="rounded-xl shadow-xl"
            unoptimized
          />
        </div>

        <div className="text-center text-sm text-gray-300 mb-4">
          Nội dung chuyển khoản:
          <br />
          <strong className="text-red-400">{transferNote}</strong>
        </div>

        <div className="text-center text-gray-300 text-sm mb-4">
          Ngân hàng: <strong className="text-white">Techcombank</strong> <br />
          Chủ tài khoản: <strong className="text-white">NGUYEN HUU NGHIA</strong> <br />
          Số tài khoản: <strong className="text-white">{ACCOUNT_NO}</strong>
        </div>

        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {confirming ? (
            <>
              <FaSpinner className="animate-spin" /> Đang xác nhận...
            </>
          ) : (
            <>
              <FaCheckCircle /> Tôi đã thanh toán
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center">
      <div className="text-white text-xl">Đang tải...</div>
    </div>
  );
}

export default function ManualPaymentPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ManualPaymentContent />
    </Suspense>
  );
}