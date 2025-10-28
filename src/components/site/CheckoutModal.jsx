// src/components/site/CheckoutModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTimes, FaMoneyBillWave, FaSpinner, 
  FaCheckCircle, FaExclamationTriangle, FaLock, FaWallet,
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingBag,
  FaCreditCard
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosClient from "@/utils/axiosClient";

export default function CheckoutModal({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    shippingAddress: "",
    paymentMethod: "cod"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        shippingAddress: "",
        paymentMethod: "cod"
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = "Vui lòng nhập địa chỉ giao hàng";
    } else if (formData.shippingAddress.trim().length < 10) {
      newErrors.shippingAddress = "Địa chỉ quá ngắn (tối thiểu 10 ký tự)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      console.log("📦 [Checkout] Starting checkout...");

      const userId = String(user?._id || user?.id || user?.userId || "");
      
      if (!userId) {
        toast.error("Không tìm thấy thông tin user!");
        return;
      }

      const payload = {
        userId: userId,
        shippingAddress: formData.shippingAddress.trim(),
        paymentMethod: formData.paymentMethod
      };

      console.log("🛒 [Checkout] Payload:", JSON.stringify(payload, null, 2));

      // ⭐ GỌI API
      const response = await axiosClient.post("/orders", payload);
      
      console.log("✅ [Checkout] Response:", response.data);

      // ⭐ SỬA: EXTRACT order từ nhiều dạng response
      const order = response.data.order || response.data.data?.order || response.data;
      const payment = response.data.payment || response.data.data?.payment;

      console.log("📦 [Checkout] Extracted order:", order);
      console.log("💳 [Checkout] Extracted payment:", payment);

      // ⭐ VALIDATE order có _id không
      if (!order || !order._id) {
        console.error("❌ [Checkout] Order không có _id:", order);
        throw new Error("Không nhận được thông tin đơn hàng từ server");
      }

      const orderId = order._id;
      console.log("✅ [Checkout] Order ID:", orderId);

      // ⭐ XỬ LÝ THEO PAYMENT METHOD
      if (formData.paymentMethod === "cod") {
        toast.success("🎉 Đặt hàng thành công!");
        localStorage.removeItem("cart");
        onClose();
        
        // ⭐ CHUYỂN HƯỚNG
        setTimeout(() => {
          window.location.href = `/site/orders/${orderId}`;
        }, 500);

      } else if (formData.paymentMethod === "momo") {
        console.log("💳 [Checkout] Creating MoMo payment...");
        
        const momoResponse = await axiosClient.post("/payments/momo", {
          orderId: orderId,
          userId: userId
        });

        const payUrl = momoResponse.data.paymentUrl || momoResponse.data.payUrl;
        
        if (!payUrl) {
          throw new Error("Không nhận được link thanh toán MoMo");
        }

        toast.info("Đang chuyển đến MoMo...");
        setTimeout(() => {
          window.location.href = payUrl;
        }, 1000);

      } else if (formData.paymentMethod === "vnpay") {
        console.log("💳 [Checkout] Creating VNPay payment...");
        
        const vnpayResponse = await axiosClient.post("/payments/vnpay", {
          orderId: orderId,
          userId: userId
        });

        const payUrl = vnpayResponse.data.paymentUrl || vnpayResponse.data.payUrl;
        
        if (!payUrl) {
          throw new Error("Không nhận được link thanh toán VNPay");
        }

        toast.info("Đang chuyển đến VNPay...");
        setTimeout(() => {
          window.location.href = payUrl;
        }, 1000);
      }

    } catch (error) {
      console.error("❌ [Checkout] Error:", error);
      
      let errorMsg = "Không thể đặt hàng!";
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      if (errorMsg.includes("Cart is empty")) {
        toast.error("Giỏ hàng trống!");
      } else if (errorMsg.includes("out of stock")) {
        toast.error("Sản phẩm hết hàng!");
      } else {
        toast.error(`❌ ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black flex items-center gap-3">
                <FaShoppingBag className="text-4xl" />
                Đặt hàng
              </h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 hover:bg-white/20 rounded-lg transition disabled:opacity-50"
              >
                <FaTimes size={24} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto max-h-[calc(90vh-88px)] p-6">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Thông tin user */}
              <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <FaUser />
                  Thông tin người đặt
                </h3>
                <div className="space-y-3 text-blue-800">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-blue-600" />
                    <span><strong>Họ tên:</strong> {user?.username || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-600" />
                    <span><strong>Email:</strong> {user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-blue-600" />
                    <span><strong>SĐT:</strong> {user?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="bg-gray-50 p-5 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Địa chỉ giao hàng
                </h3>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Địa chỉ nhận hàng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className={`w-full px-4 py-3 border-2 ${errors.shippingAddress ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:border-green-500 outline-none transition resize-none`}
                    rows="4"
                    placeholder="Ví dụ: 213 đinh bộ lĩnh, bình thạnh, TP.HCM"
                    disabled={loading}
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <FaExclamationTriangle /> {errors.shippingAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-gray-50 p-5 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  💳 Phương thức thanh toán
                </h3>

                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border-2 ${formData.paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200'} rounded-xl cursor-pointer hover:border-green-500 transition`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      disabled={loading}
                      className="w-5 h-5"
                    />
                    <FaMoneyBillWave className="text-2xl text-green-600" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block">COD</span>
                      <span className="text-sm text-gray-600">Thanh toán khi nhận hàng</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 ${formData.paymentMethod === 'momo' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'} rounded-xl cursor-pointer hover:border-pink-500 transition`}>
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={formData.paymentMethod === "momo"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      disabled={loading}
                      className="w-5 h-5"
                    />
                    <FaWallet className="text-2xl text-pink-600" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block">MoMo</span>
                      <span className="text-sm text-gray-600">Thanh toán qua ví MoMo</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 border-2 ${formData.paymentMethod === 'vnpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-xl cursor-pointer hover:border-blue-500 transition`}>
                    <input
                      type="radio"
                      name="payment"
                      value="vnpay"
                      checked={formData.paymentMethod === "vnpay"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      disabled={loading}
                      className="w-5 h-5"
                    />
                    <FaCreditCard className="text-2xl text-blue-600" />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 block">VNPay</span>
                      <span className="text-sm text-gray-600">Thanh toán qua ATM/Visa</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
                <p className="text-sm text-yellow-800">
                  📝 <strong>Backend sẽ tự động:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
                  <li>Lấy giỏ hàng từ database</li>
                  <li>Kiểm tra tồn kho sản phẩm</li>
                  <li>Tạo đơn hàng với user info</li>
                  <li>Tạo bản ghi thanh toán</li>
                  <li>Xóa giỏ hàng</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-2xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Xác nhận đặt hàng
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                <FaCheckCircle className="text-green-500" />
                <span>Bảo mật 100%. Đổi trả trong 7 ngày.</span>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}