"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaShoppingBag, FaSpinner, FaEye, FaBan, FaClock, FaCheckCircle, FaTruck, FaBox } from "react-icons/fa";

import { getUserOrders, cancelOrder } from "@/services/orderService";
import { getCurrentUser, me } from "@/services/authService";

// ⭐ Status mapping
const STATUS_CONFIG = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: FaClock
  },
  awaiting_confirmation: {
    label: "Chờ xác nhận TT",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: FaClock
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: FaCheckCircle
  },
  shipped: {
    label: "Đang giao",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: FaTruck
  },
  delivered: {
    label: "Đã giao",
    color: "bg-teal-100 text-teal-800 border-teal-300",
    icon: FaBox
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: FaBan
  }
};

// ⭐ Payment method mapping
const PAYMENT_METHOD = {
  cod: "COD (Tiền mặt)",
  bank: "Chuyển khoản",
  momo: "MoMo",
  vnpay: "VNPay"
};

export default function UserOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 10
  });

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
          toast.error("Vui lòng đăng nhập để xem đơn hàng!");
          router.push("/site/auth/login?redirect=/site/orders");
          return;
        }
      }
      
      setCurrentUser(user);
    };
    
    loadUser();
  }, [router]);

  // ⭐ Load orders
  useEffect(() => {
    if (!currentUser) return;
    
    const loadOrders = async () => {
      try {
        setLoading(true);
        const userId = currentUser._id || currentUser.id;
        
        console.log("📦 Loading orders for user:", userId);
        
        const response = await getUserOrders(userId, filters);
        
        console.log("✅ Orders response:", response);
        
        // ⭐ Backend trả về { orders, pagination } hoặc { orders, currentPage, totalPages, total }
        const ordersData = response.orders || [];
        const paginationData = response.pagination || {
          page: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          total: response.total || 0
        };
        
        setOrders(ordersData);
        setPagination({
          currentPage: paginationData.page || paginationData.currentPage || 1,
          totalPages: paginationData.totalPages || 1,
          totalOrders: paginationData.total || 0
        });
        
      } catch (error) {
        console.error("❌ Load orders error:", error);
        toast.error("Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [currentUser, filters]);

  // ⭐ Handle cancel order
  const handleCancelOrder = async (orderId) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    
    try {
      const userId = currentUser._id || currentUser.id;
      const reason = prompt("Lý do hủy đơn (không bắt buộc):");
      
      await cancelOrder(orderId, userId, reason);
      
      toast.success("✅ Đã hủy đơn hàng!");
      
      // Reload orders
      setFilters({ ...filters });
      
    } catch (error) {
      console.error("❌ Cancel order error:", error);
      toast.error(error.message || "Không thể hủy đơn hàng!");
    }
  };

  // ⭐ Handle view details
  const handleViewDetails = (orderId) => {
    router.push(`/site/orders/${orderId}`);
  };

  // ⭐ Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1 // Reset về trang 1 khi thay đổi filter
    });
  };

  // ⭐ Handle page change
  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FaShoppingBag className="text-3xl text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
          </div>
          
          <p className="text-gray-600">
            Tổng số: <span className="font-bold text-green-600">{pagination.totalOrders}</span> đơn hàng
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-semibold text-gray-700">Lọc theo trạng thái:</label>
            
            <button
              onClick={() => handleFilterChange("status", "")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filters.status === ""
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleFilterChange("status", key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  filters.status === key
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <config.icon />
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa đặt đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!</p>
            <button
              onClick={() => router.push("/site/products")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                      <p className="font-bold text-gray-800">#{order._id?.slice(-8).toUpperCase() || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Ngày đặt</p>
                      <p className="font-semibold text-gray-700">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
                      <p className="font-bold text-green-600 text-lg">
                        {(order.totalPrice || order.totalAmount || 0).toLocaleString()} đ
                      </p>
                    </div>
                    
                    <div>
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border-2 ${statusConfig.color}`}>
                        <StatusIcon />
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Phương thức thanh toán</p>
                        <p className="font-semibold text-gray-800">
                          {PAYMENT_METHOD[order.paymentMethod] || order.paymentMethod || "N/A"}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Địa chỉ giao hàng</p>
                        <p className="font-semibold text-gray-800 line-clamp-1">
                          {order.shippingAddress || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleViewDetails(order._id)}
                      className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <FaEye />
                      Xem chi tiết
                    </button>
                    
                    {(order.status === "pending" || order.status === "awaiting_confirmation") && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex-1 md:flex-none bg-red-100 text-red-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-200 transition-all flex items-center justify-center gap-2 border-2 border-red-300"
                      >
                        <FaBan />
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              <span className="px-4 py-2 text-gray-700 font-semibold">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
