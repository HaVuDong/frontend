"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCreditCard, FaTruck, FaShoppingBag, FaSpinner, FaLock } from "react-icons/fa";
import Link from "next/link";
import { getCart, calculateCartTotal } from "@/services/cartService";
import { createOrder } from "@/services/orderService";
import { createMoMoPayment, createVNPayPayment } from "@/services/paymentService";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // Form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    loadUserAndCart();
  }, []);

  const loadUserAndCart = async () => {
    setLoading(true);
    try {
      // Get user from cookie/localStorage
      const userCookie = Cookies.get("user");
      let parsedUser = null;
      
      if (userCookie) {
        try {
          parsedUser = JSON.parse(decodeURIComponent(userCookie));
        } catch (e) {
          console.error("Parse user cookie error:", e);
        }
      }
      
      if (!parsedUser) {
        const localUser = localStorage.getItem("user");
        if (localUser) {
          try {
            parsedUser = JSON.parse(localUser);
          } catch (e) {
            console.error("Parse localStorage user error:", e);
          }
        }
      }

      // Check JWT token
      const jwtToken = Cookies.get("jwt");
      if (!jwtToken || !parsedUser) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        router.push("/site/auth/login");
        return;
      }

      setUser(parsedUser);

      // Pre-fill user info
      if (parsedUser.username) setFullName(parsedUser.username);
      if (parsedUser.phone) setPhone(parsedUser.phone);

      // Load cart
      if (parsedUser._id || parsedUser.id) {
        const uid = parsedUser._id || parsedUser.id;
        const data = await getCart(uid);
        const items = data.cart?.items || data.items || [];
        
        if (items.length === 0) {
          toast.warning("Giỏ hàng trống");
          router.push("/site/cart");
          return;
        }
        
        setCartItems(items);
      }
    } catch (err) {
      console.error("Load cart error:", err);
      toast.error("Không thể tải giỏ hàng");
      router.push("/site/cart");
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = calculateCartTotal(cartItems);

  const validateForm = () => {
    if (!fullName || fullName.trim().length < 2) {
      toast.error("Vui lòng nhập tên người nhận (ít nhất 2 ký tự)");
      return false;
    }

    if (!phone || phone.trim().length < 9) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ (ít nhất 9 số)");
      return false;
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      toast.error("Số điện thoại không đúng định dạng");
      return false;
    }

    if (!address || address.trim().length < 10) {
      toast.error("Vui lòng nhập địa chỉ giao hàng đầy đủ (ít nhất 10 ký tự)");
      return false;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Giỏ hàng trống");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !(user._id || user.id)) {
      toast.error("Bạn cần đăng nhập để tiếp tục thanh toán");
      router.push("/site/auth/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Build shippingAddress string
      const shippingAddress = `${fullName.trim()} — ${phone.trim()} — ${address.trim()}`;

      // 1) Create order - SỬ DỤNG SERVICE CÓ SẴN
      const orderPayload = {
        userId: user._id || user.id,
        shippingAddress,
        paymentMethod
      };

      console.log("Creating order with payload:", orderPayload);

      const orderResponse = await createOrder(orderPayload);

      if (!orderResponse || !orderResponse.success) {
        throw new Error(orderResponse?.message || "Tạo đơn hàng thất bại");
      }

      const order = orderResponse.order;
      const orderId = order._id;
      const userId = user._id || user.id;

      toast.success("Đơn hàng đã được tạo thành công!");

      // 2) Handle payment based on method
      if (paymentMethod === "momo") {
        toast.info("Đang tạo link thanh toán MoMo...");
        
        const momoResponse = await createMoMoPayment(orderId, userId);
        
        // Backend trả về: { message, paymentUrl, orderId, amount, requestId }
        if (momoResponse?.paymentUrl) {
          toast.success("Chuyển hướng đến MoMo...");
          window.location.href = momoResponse.paymentUrl;
          return;
        } else {
          throw new Error("Không lấy được link thanh toán MoMo");
        }
      } 
      else if (paymentMethod === "vnpay") {
        toast.info("Đang tạo link thanh toán VNPay...");
        
        const vnpayResponse = await createVNPayPayment(orderId, userId);
        
        // Backend trả về: { message, paymentUrl, orderId, amount, createDate, expireDate }
        if (vnpayResponse?.paymentUrl) {
          toast.success("Chuyển hướng đến VNPay...");
          window.location.href = vnpayResponse.paymentUrl;
          return;
        } else {
          throw new Error("Không lấy được link thanh toán VNPay");
        }
      } 
      else if (paymentMethod === "cod") {
        // COD - no payment gateway, just redirect to order detail
        toast.success("Đặt hàng thành công! Thanh toán khi nhận hàng.");
        setTimeout(() => {
          router.push(`/site/orders/${orderId}`);
        }, 1500);
        return;
      } 
      else if (paymentMethod === "bank") {
        toast.success("Đơn hàng đã tạo. Vui lòng chuyển khoản theo hướng dẫn.");
        setTimeout(() => {
          router.push(`/site/orders/${orderId}`);
        }, 1500);
        return;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      
      // Xử lý error từ axiosClient
      const errorMessage = error.response?.data?.message || error.message || "Đặt hàng thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-green-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/site/cart" 
          className="inline-flex items-center gap-2 mb-6 text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          <FaArrowLeft /> Quay lại giỏ hàng
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3 mb-6">
            <FaCreditCard className="text-green-600" />
            Thanh toán
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="0912345678"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Địa chỉ nhận hàng <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-3">
                  Phương thức thanh toán <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label 
                    className={`p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50 ${
                      paymentMethod === "cod" ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaTruck className="text-green-600 text-xl" />
                      <div>
                        <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === "cod"} 
                      onChange={() => setPaymentMethod("cod")}
                      className="w-5 h-5 text-green-600"
                    />
                  </label>

                  <label 
                    className={`p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50 ${
                      paymentMethod === "momo" ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-pink-600 font-bold">M</span>
                      </div>
                      <div>
                        <div className="font-semibold">Ví MoMo</div>
                        <div className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="momo" 
                      checked={paymentMethod === "momo"} 
                      onChange={() => setPaymentMethod("momo")}
                      className="w-5 h-5 text-green-600"
                    />
                  </label>

                  <label 
                    className={`p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50 ${
                      paymentMethod === "vnpay" ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">V</span>
                      </div>
                      <div>
                        <div className="font-semibold">VNPay</div>
                        <div className="text-sm text-gray-500">Thanh toán qua cổng VNPay</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="vnpay" 
                      checked={paymentMethod === "vnpay"} 
                      onChange={() => setPaymentMethod("vnpay")}
                      className="w-5 h-5 text-green-600"
                    />
                  </label>

                  <label 
                    className={`p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50 ${
                      paymentMethod === "bank" ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaCreditCard className="text-blue-600 text-xl" />
                      <div>
                        <div className="font-semibold">Chuyển khoản ngân hàng</div>
                        <div className="text-sm text-gray-500">Hướng dẫn sau khi đặt hàng</div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="bank" 
                      checked={paymentMethod === "bank"} 
                      onChange={() => setPaymentMethod("bank")}
                      className="w-5 h-5 text-green-600"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Đặt hàng {cartTotal.total.toLocaleString()} đ
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                Bằng cách đặt hàng, bạn đồng ý với <span className="text-green-600 hover:underline cursor-pointer">Điều khoản sử dụng</span>
              </div>
            </form>

            {/* Right: Order Summary */}
            <div className="bg-gray-50 p-6 rounded-xl h-fit sticky top-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Tóm tắt đơn hàng</h3>

              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {cartItems.map((item) => {
                  const id = item.productId?._id || item.productId;
                  return (
                    <div key={id} className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-b-0">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="object-contain w-full h-full p-1" />
                        ) : (
                          <div className="text-3xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 line-clamp-2 text-sm">{item.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.quantity} × {item.price?.toLocaleString()} đ
                        </div>
                      </div>
                      <div className="font-bold text-green-600 flex-shrink-0">
                        {(item.price * item.quantity).toLocaleString()} đ
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-300 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({cartTotal.itemCount} SP)</span>
                  <span className="font-semibold">{cartTotal.subtotal.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                  <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-black text-green-600">
                    {cartTotal.total.toLocaleString()} đ
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-gray-600">
                  <strong className="text-blue-800">💡 Lưu ý:</strong> Với phương thức thanh toán MoMo/VNPay, 
                  bạn sẽ được chuyển đến cổng thanh toán. Vui lòng hoàn tất giao dịch để xác nhận đơn hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}