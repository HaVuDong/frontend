"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCreditCard,
  FaShoppingBag,
  FaSpinner,
  FaLock,
  FaTruck
} from "react-icons/fa";
import Link from "next/link";
import { getCart, calculateCartTotal } from "@/services/cartService";
import { createOrder } from "@/services/orderService";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // MẶC ĐỊNH: chuyển khoản ngân hàng (bank)
  const [paymentMethod, setPaymentMethod] = useState("bank");

  // =============================
  // LOAD USER + CART
  // =============================
  useEffect(() => {
    loadUserAndCart();
  }, []);

  const loadUserAndCart = async () => {
    setLoading(true);
    try {
      const localUser = localStorage.getItem("user");
      let parsedUser = localUser ? JSON.parse(localUser) : null;

      const jwtToken = Cookies.get("jwt");

      if (!jwtToken || !parsedUser) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        router.push("/site/auth/login");
        return;
      }

      setUser(parsedUser);
      setFullName(parsedUser.username || "");
      setPhone(parsedUser.phone || "");

      const uid = parsedUser._id || parsedUser.id;
      const data = await getCart(uid);
      const items = data.cart?.items || data.items || [];

      if (items.length === 0) {
        toast.warning("Giỏ hàng của bạn đang trống");
        router.push("/site/cart");
        return;
      }

      setCartItems(items);
    } catch (error) {
      toast.error("Không thể tải giỏ hàng");
      router.push("/site/cart");
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = calculateCartTotal(cartItems);

  // =============================
  // VALIDATE
  // =============================
  const validateForm = () => {
    if (fullName.trim().length < 2) {
      toast.error("Tên người nhận không hợp lệ");
      return false;
    }
    if (!/^[0-9]{9,11}$/.test(phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }
    if (address.trim().length < 10) {
      toast.error("Địa chỉ quá ngắn");
      return false;
    }
    return true;
  };

  // =============================
  // SUBMIT ORDER
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const shippingAddress = `${fullName} - ${phone} - ${address}`;
      const payload = {
        userId: user._id || user.id,
        shippingAddress,
        paymentMethod: paymentMethod, // ✔ dùng đúng giá trị người dùng chọn
      };

      const orderResponse = await createOrder(payload);

      if (!orderResponse?.success) throw new Error("Không tạo được đơn hàng");

      const order = orderResponse.order;
      const orderId = order._id;
      const total = cartTotal.total;

      toast.success("Đơn hàng đã được tạo!");

      // =============================
      // XỬ LÝ CHỌN THANH TOÁN
      // =============================

      // ✔ COD — quay về trang chủ
      if (paymentMethod === "cod") {
        router.push("/site");
        return;
      }

      // ✔ BANK — qua trang QR
      router.push(
        `/site/payment/manual?orderId=${orderId}&amount=${total}&name=${encodeURIComponent(
          fullName
        )}&phone=${phone}`
      );
    } catch (err) {
      toast.error("Thanh toán thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <Link href="/site/cart" className="text-green-600 flex items-center gap-2 mb-4">
          <FaArrowLeft /> Quay lại giỏ hàng
        </Link>

        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <FaShoppingBag /> Thanh toán
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-medium">Tên người nhận</label>
                <input
                  className="w-full p-3 border rounded-xl"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium">Số điện thoại</label>
                <input
                  className="w-full p-3 border rounded-xl"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium">Địa chỉ nhận hàng</label>
                <textarea
                  className="w-full p-3 border rounded-xl"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* PHƯƠNG THỨC THANH TOÁN */}
              <div>
                <label className="font-medium">Phương thức thanh toán</label>

                {/* COD */}
                <PaymentOption
                  title="Thanh toán khi nhận hàng (COD)"
                  desc="Thanh toán bằng tiền mặt khi nhận hàng"
                  value="cod"
                  icon={<FaTruck className="text-green-600 text-xl" />}
                  active={paymentMethod === "cod"}
                  onSelect={() => setPaymentMethod("cod")}
                />

                {/* BANK */}
                <PaymentOption
                  title="Chuyển khoản ngân hàng (VietQR)"
                  desc="Quét QR để thanh toán"
                  value="bank"
                  icon={<FaCreditCard className="text-blue-600 text-xl" />}
                  active={paymentMethod === "bank"}
                  onSelect={() => setPaymentMethod("bank")}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaLock /> Đặt hàng {cartTotal.total.toLocaleString()} đ
                  </>
                )}
              </button>
            </form>

            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />

          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   COMPONENT PAYMENT OPTION
========================= */
function PaymentOption({ title, desc, value, icon, active, onSelect }) {
  return (
    <label
      className={`p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer ${
        active ? "border-green-500 bg-green-50" : "border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{desc}</div>
        </div>
      </div>

      <input type="radio" checked={active} onChange={onSelect} />
    </label>
  );
}

/* =========================
   ORDER SUMMARY
========================= */
function OrderSummary({ cartItems, cartTotal }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h3>

      {cartItems.map((item, index) => (
        <div key={index} className="flex justify-between py-2 border-b">
          <span>{item.name} x {item.quantity}</span>
          <span>{(item.price * item.quantity).toLocaleString()} đ</span>
        </div>
      ))}

      <div className="flex justify-between mt-4 text-lg font-bold">
        <span>Tổng cộng:</span>
        <span className="text-green-600">{cartTotal.total.toLocaleString()} đ</span>
      </div>
    </div>
  );
}
