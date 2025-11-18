"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ManualPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = Number(searchParams.get("amount") || 0);
  const orderId = searchParams.get("orderId");

  // Lấy thêm thông tin khách hàng từ query
  const buyerName = searchParams.get("name") || "Khach";
  const buyerPhone = searchParams.get("phone") || "0000000000";

  // Nội dung chuyển khoản
  const transferNote = `DH${orderId}-${buyerName}-${buyerPhone}`;

  // THÔNG TIN NGÂN HÀNG CỦA BẠN
  const BANK_CODE = "970407";
  const ACCOUNT_NO = "50977451512";
  const accountName = "NGUYEN HUU NGHIA";

  // Tạo QR động VietQR
  const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferNote
  )}`;

  const handleConfirm = () => {
  toast.success("Cảm ơn bạn! Cảm ơn bạn đã thanh toán ❤️");

  setTimeout(() => {
    router.push("/site"); // quay về trang chủ
  }, 1000); // đợi toast chạy
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

        {/* QR Code động */}
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

        {/* Nội dung bắt buộc */}
        <div className="text-center text-sm text-gray-300 mb-4">
          Nội dung chuyển khoản:
          <br />
          <strong className="text-red-400">{transferNote}</strong>
        </div>

        {/* STK ngân hàng hiển thị cho khách */}
        <div className="text-center text-gray-300 text-sm mb-4">
          Ngân hàng: <strong className="text-white">Techcombank</strong> <br />
          Chủ tài khoản: <strong className="text-white">NGUYEN HUU NGHIA</strong> <br />
          Số tài khoản: <strong className="text-white">{ACCOUNT_NO}</strong>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <FaCheckCircle /> Tôi đã thanh toán
        </button>
      </div>
    </div>
  );
}
