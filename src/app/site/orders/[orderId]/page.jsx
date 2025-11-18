"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { 
  FaArrowLeft, FaSpinner, FaShoppingBag, FaClock, FaCheckCircle, 
  FaTruck, FaBox, FaBan, FaPhone, FaMapMarkerAlt, FaMoneyBillWave 
} from "react-icons/fa";

import { getOrderById, cancelOrder } from "@/services/orderService";
import { getCurrentUser, me } from "@/services/authService";

// ⭐ Status config (same as list page)
const STATUS_CONFIG = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: FaClock
  },
  awaiting_confirmation: {
    label: "Chờ xác nhận thanh toán",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: FaClock
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: FaCheckCircle
  },
  shipped: {
    label: "Đang giao hàng",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: FaTruck
  },
  delivered: {
    label: "Đã giao hàng",
    color: "bg-teal-100 text-teal-800 border-teal-300",
    icon: FaBox
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: FaBan
  }
};

const PAYMENT_METHOD = {
  cod: "COD (Tiền mặt)",
  bank: "Chuyển khoản ngân hàng",
  momo: "Ví MoMo",
  vnpay: "VNPay"
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ⭐ Load user
  useEffect(() => {
    const loadUser = async () => {
      let user = getCurrentUser();
      
      if (!user) {
        try {
          const userData = await me();
          if (userData) {
            user = userData;
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (error) {
          console.error("❌ Cannot fetch user:", error);
          toast.error("Vui lòng đăng nhập!");
          router.push("/site/auth/login?redirect=/site/orders");
          return;
        }
      }
      
      setCurrentUser(user);
    };
    
    loadUser();
  }, [router]);

  // ⭐ Load order detail
  useEffect(() => {
    if (!currentUser || !orderId) return;
    
    const loadOrder = async () => {
      try {
        setLoading(true);
        const userId = currentUser._id || currentUser.id;
        
        console.log("📦 Loading order detail:", orderId);
        
        const response = await getOrderById(orderId, userId);
        
        console.log("✅ Order detail:", response);
        
        setOrder(response);
        
      } catch (error) {
        console.error("❌ Load order error:", error);
        toast.error("Không thể tải thông tin đơn hàng!");
        router.push("/site/orders");
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [currentUser, orderId, router]);

  // ⭐ Handle cancel order
  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    
    try {
      const userId = currentUser._id || currentUser.id;
      const reason = prompt("Lý do hủy đơn (không bắt buộc):");
      
      await cancelOrder(orderId, userId, reason);
      
      toast.success("✅ Đã hủy đơn hàng!");
      
      // Reload order
      const response = await getOrderById(orderId, userId);
      setOrder(response);
      
    } catch (error) {
      console.error("❌ Cancel order error:", error);
      toast.error(error.message || "Không thể hủy đơn hàng!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaBan className="text-6xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h2>
          <button
            onClick={() => router.push("/site/orders")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/site/orders")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-6 transition-all"
        >
          <FaArrowLeft />
          Quay lại danh sách đơn hàng
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <FaShoppingBag className="text-green-600" />
                Chi tiết đơn hàng
              </h1>
              <p className="text-gray-600">
                Mã đơn: <span className="font-bold text-gray-800">#{order._id?.slice(-8).toUpperCase() || "N/A"}</span>
              </p>
              <p className="text-sm text-gray-500">
                Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "N/A"}
              </p>
            </div>
            
            <div className="text-right">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border-2 ${statusConfig.color}`}>
                <StatusIcon />
                {statusConfig.label}
              </span>
              
              {(order.status === "pending" || order.status === "awaiting_confirmation") && (
                <button
                  onClick={handleCancelOrder}
                  className="mt-3 w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-all flex items-center justify-center gap-2 border-2 border-red-300"
                >
                  <FaBan />
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Shipping Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" />
              Thông tin giao hàng
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Người nhận</p>
                <p className="font-semibold text-gray-800">{order.shippingAddress?.split(" - ")[0] || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaPhone className="text-green-600" />
                  {order.shippingAddress?.split(" - ")[1] || "N/A"}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-semibold text-gray-800">{order.shippingAddress?.split(" - ").slice(2).join(" - ") || order.shippingAddress || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600" />
              Thông tin thanh toán
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Phương thức</p>
                <p className="font-semibold text-gray-800">
                  {PAYMENT_METHOD[order.paymentMethod] || order.paymentMethod || "N/A"}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Tổng tiền sản phẩm</p>
                <p className="font-semibold text-gray-800">
                  {((order.totalPrice || order.totalAmount || 0) - (order.shippingFee || 0)).toLocaleString()} đ
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Phí vận chuyển</p>
                <p className="font-semibold text-gray-800">
                  {(order.shippingFee || 0).toLocaleString()} đ
                </p>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-sm text-gray-500">Tổng thanh toán</p>
                <p className="text-2xl font-bold text-green-600">
                  {(order.totalPrice || order.totalAmount || 0).toLocaleString()} đ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaBox className="text-green-600" />
            Sản phẩm ({order.items?.length || 0})
          </h3>
          
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-green-200 transition-all"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaBox className="text-3xl text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">
                    {item.product?.name || "Sản phẩm"}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    Số lượng: <span className="font-semibold text-gray-700">x{item.quantity || 0}</span>
                  </p>
                  <p className="text-green-600 font-bold">
                    {(item.price || 0).toLocaleString()} đ
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Thành tiền</p>
                  <p className="text-lg font-bold text-gray-800">
                    {((item.price || 0) * (item.quantity || 0)).toLocaleString()} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Timeline */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Lịch sử đơn hàng</h3>
            
            <div className="space-y-3">
              {order.statusHistory.map((history, index) => {
                const historyConfig = STATUS_CONFIG[history.status] || STATUS_CONFIG.pending;
                const HistoryIcon = historyConfig.icon;
                
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${historyConfig.color}`}>
                      <HistoryIcon />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{historyConfig.label}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(history.timestamp).toLocaleString("vi-VN")}
                      </p>
                      {history.note && (
                        <p className="text-sm text-gray-600 mt-1">Ghi chú: {history.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
