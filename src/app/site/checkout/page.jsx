import "client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCreditCard, FaTruck, FaShoppingBag, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { getCart, calculateCartTotal } from "@/services/cartService";
import {
  createOrder as apiCreateOrder,
  createMoMoPayment,
  createVNPayPayment,
  confirmCODPayment
} from "@/services/checkoutService";

/**
 * Checkout page
 *
 * - Loads cart from backend (using existing cartService.getCart)
 * - Collects shipping address and payment method
 * - Calls backend to create order
 * - If payment method is momo/vnpay -> requests payment link and redirects user
 * - If COD -> confirms COD payment (backend may simply mark order/payment pending/confirmed)
 *
 * Notes:
 * - This code expects an environment variable NEXT_PUBLIC_API_URL to point to the backend API.
 * - The checkout service functions call:
 *    POST {API}/orders         -> create order
 *    POST {API}/payments/momo  -> create momo payment (returns payUrl)
 *    POST {API}/payments/vnpay -> create vnpay payment (returns paymentUrl)
 *    POST {API}/payments/cod/:orderId -> confirm COD (adjust if your routes differ)
 * - If your API routes differ, update services/checkoutService.js accordingly.
 */

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
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod | momo | vnpay | bank

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Try to get user data from cookie/localStorage (same logic as cart page)
        const userCookie = Cookies.get("user");
        let parsedUser = null;
        if (userCookie) {
          try {
            parsedUser = JSON.parse(decodeURIComponent(userCookie));
          } catch (e) {
            // ignore
          }
        }
        if (!parsedUser) {
          const localUser = localStorage.getItem("user");
          if (localUser) parsedUser = JSON.parse(localUser);
        }
        setUser(parsedUser || null);

        if (parsedUser && (parsedUser._id || parsedUser.id)) {
          const uid = parsedUser._id || parsedUser.id;
          const data = await getCart(uid);
          const items = data.cart?.items || data.items || [];
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Load cart error:", err);
        toast.error("Không thể tải giỏ hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cartTotal = calculateCartTotal(cartItems);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !(user._id || user.id)) {
      toast.error("Bạn cần đăng nhập để tiếp tục thanh toán");
      router.push("/site/auth/login");
      return;
    }

    if (!address || address.trim().length < 10) {
      toast.error("Vui lòng nhập địa chỉ giao hàng hợp lệ (ít nhất 10 ký tự).");
      return;
    }

    if (!fullName || fullName.trim().length < 2) {
      toast.error("Vui lòng nhập tên người nhận.");
      return;
    }

    if (!phone || phone.trim().length < 6) {
      toast.error("Vui lòng nhập số điện thoại.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Giỏ hàng trống.");
      return;
    }

    try {
      setSubmitting(true);

      // Build shippingAddress string (backend expects a string)
      const shippingAddress = `${fullName} — ${phone} — ${address}`;

      // 1) Create order on backend. The backend orderService will fetch cart by userId.
      const payload = {
        userId: user._id || user.id,
        shippingAddress,
        paymentMethod
      };

      const createRes = await apiCreateOrder(payload);

      if (!createRes || !createRes.success) {
        throw new Error(createRes?.message || "Tạo đơn hàng thất bại");
      }

      const order = createRes.order;
      toast.success("Đơn hàng đã được tạo");

      // 2) Depending on payment method, either redirect to gateway or confirm COD
      if (paymentMethod === "momo") {
        // Create MoMo payment link then redirect
        const momoRes = await createMoMoPayment({ orderId: order._id, userId: user._id || user.id });
        if (momoRes?.paymentUrl) {
          toast.info("Đang chuyển qua cổng MoMo...");
          window.location.href = momoRes.paymentUrl;
          return;
        } else {
          throw new Error("Không lấy được link thanh toán MoMo");
        }
      } else if (paymentMethod === "vnpay") {
        // Create VNPay payment link then redirect
        const vnpayRes = await createVNPayPayment({ orderId: order._id, userId: user._id || user.id });
        if (vnpayRes?.paymentUrl) {
          toast.info("Đang chuyển qua cổng VNPay...");
          window.location.href = vnpayRes.paymentUrl;
          return;
        } else {
          throw new Error("Không lấy được link thanh toán VNPay");
        }
      } else if (paymentMethod === "cod") {
        // Confirm COD payment (backend will mark payment/order accordingly)
        // The confirm endpoint path may vary — services/checkoutService.js centralizes that.
        const confirmRes = await confirmCODPayment(order._id, user._id || user.id);
        if (confirmRes?.success) {
          toast.success("Đặt hàng thành công. Thanh toán khi nhận hàng.");
          router.push(`/site/orders/${order._id}`);
          return;
        } else {
          toast.success("Đặt hàng thành công. Kiểm tra trạng thái đơn hàng.");
          router.push(`/site/orders/${order._id}`);
          return;
        }
      } else {
        // bank transfer or other
        toast.success("Đơn hàng đã tạo. Vui lòng làm theo hướng dẫn để thanh toán.");
        router.push(`/site/orders/${order._id}`);
        return;
      }
    } catch (error) {
      console.error("Checkout submit error:", error);
      toast.error(error.message || "Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-green-600 mx-auto mb-4" />
          <p className="text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/site/cart" className="inline-flex items-center gap-2 mb-6">
          <FaArrowLeft /> Quay lại giỏ hàng
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
            <FaCreditCard className="text-green-600" />
            Thanh toán
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Tên người nhận</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full mt-2 p-3 border rounded-xl"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Số điện thoại</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-2 p-3 border rounded-xl"
                  placeholder="0912345678"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Địa chỉ nhận hàng</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-2 p-3 border rounded-xl"
                  placeholder="Số nhà, đường, quận, thành phố..."
                  rows={4}
                />
              </div>

              <div>
                <label className="font-medium text-gray-700">Phương thức thanh toán</label>
                <div className="mt-3 flex flex-col gap-2">
                  <label className={`p-3 border rounded-xl flex items-center justify-between ${paymentMethod === "cod" ? "border-green-500 bg-green-50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <FaTruck className="text-green-600" />
                      Thanh toán khi nhận hàng (COD)
                    </div>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  </label>

                  <label className={`p-3 border rounded-xl flex items-center justify-between ${paymentMethod === "momo" ? "border-green-500 bg-green-50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">MoMo</span>
                      <small className="text-gray-500">Thanh toán ví MoMo</small>
                    </div>
                    <input type="radio" name="payment" value="momo" checked={paymentMethod === "momo"} onChange={() => setPaymentMethod("momo")} />
                  </label>

                  <label className={`p-3 border rounded-xl flex items-center justify-between ${paymentMethod === "vnpay" ? "border-green-500 bg-green-50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">VNPay</span>
                      <small className="text-gray-500">Thanh toán qua VNPay</small>
                    </div>
                    <input type="radio" name="payment" value="vnpay" checked={paymentMethod === "vnpay"} onChange={() => setPaymentMethod("vnpay")} />
                  </label>

                  <label className={`p-3 border rounded-xl flex items-center justify-between ${paymentMethod === "bank" ? "border-green-500 bg-green-50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">Chuyển khoản</span>
                      <small className="text-gray-500">Hướng dẫn chuyển khoản sẽ hiển thị sau</small>
                    </div>
                    <input type="radio" name="payment" value="bank" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} />
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaShoppingBag />}
                  {submitting ? "Đang xử lý..." : `Thanh toán ${cartTotal.total.toLocaleString()} đ`}
                </button>
              </div>
            </form>

            {/* Right: order summary */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h3>

              {cartItems.map((it) => {
                const id = it.productId?._id || it.productId;
                return (
                  <div key={id} className="flex items-center gap-3 py-3 border-b last:border-b-0">
                    <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center overflow-hidden">
                      {it.image ? <img src={it.image} alt={it.name} className="object-contain w-full h-full" /> : <div className="text-2xl">📦</div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 line-clamp-2">{it.name}</div>
                      <div className="text-sm text-gray-500">{it.quantity} × {it.price?.toLocaleString()} đ</div>
                    </div>
                    <div className="font-bold text-green-600">{(it.price * it.quantity).toLocaleString()} đ</div>
                  </div>
                );
              })}

              <div className="mt-4 border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{cartTotal.subtotal.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-2xl text-green-600">{cartTotal.total.toLocaleString()} đ</span>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p><strong>Lưu ý:</strong> Sau khi thanh toán chuyển hướng về cổng thanh toán, vui lòng hoàn tất giao dịch trên trang cổng để xác nhận.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}