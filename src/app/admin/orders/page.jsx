"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaCheckCircle, FaSpinner, FaClock, FaTruck, FaBan } from "react-icons/fa";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { adminConfirmBankTransfer } from "@/services/paymentService";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "all") params.status = filter;
      
      const response = await getAllOrders(params);
      setOrders(response.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (orderId) => {
    try {
      setProcessing(prev => ({ ...prev, [orderId]: true }));
      
      const response = await adminConfirmBankTransfer(orderId);
      console.log("✅ Confirm payment response:", response);
      
      toast.success("✅ Đã xác nhận thanh toán!");
      
      // Đợi một chút rồi mới fetch lại để đảm bảo DB đã update
      setTimeout(() => {
        fetchOrders();
      }, 500);
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error(error?.message || error.response?.data?.message || "Không thể xác nhận thanh toán!");
    } finally {
      setProcessing(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setProcessing(prev => ({ ...prev, [orderId]: true }));
      
      const response = await updateOrderStatus(orderId, newStatus);
      console.log("✅ Update status response:", response);
      
      toast.success(`✅ Đã cập nhật trạng thái thành ${getStatusText(newStatus)}`);
      
      // Đợi một chút rồi mới fetch lại để đảm bảo DB đã update
      setTimeout(() => {
        fetchOrders();
      }, 500);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error?.message || "Không thể cập nhật trạng thái!");
    } finally {
      setProcessing(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      awaiting_confirmation: "bg-orange-500",
      confirmed: "bg-blue-500",
      shipped: "bg-purple-500",
      delivered: "bg-green-500",
      cancelled: "bg-red-500"
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Chờ xử lý",
      awaiting_confirmation: "Chờ xác nhận thanh toán",
      confirmed: "Đã xác nhận",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy"
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-400" />,
      awaiting_confirmation: <FaClock className="text-orange-400" />,
      confirmed: <FaCheckCircle className="text-blue-400" />,
      shipped: <FaTruck className="text-purple-400" />,
      delivered: <FaCheckCircle className="text-green-400" />,
      cancelled: <FaBan className="text-red-400" />
    };
    return icons[status] || <FaClock />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Quản lý đơn hàng
          </h1>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "pending", "awaiting_confirmation", "confirmed", "shipped", "delivered", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {status === "all" ? "Tất cả" : getStatusText(status)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Mã đơn: <span className="font-mono font-bold text-gray-800">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Khách hàng: <span className="font-semibold text-gray-800">{order.userInfo?.name}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      SĐT: <span className="font-semibold text-gray-800">{order.userInfo?.phone}</span>
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)} text-white text-sm font-semibold`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </div>
                    <p className="text-xl font-bold text-gray-800 mt-2">
                      {order.totalPrice?.toLocaleString()} đ
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Sản phẩm:</p>
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} đ</span>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700">Địa chỉ giao hàng:</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                </div>

                {/* Payment Method */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Phương thức thanh toán: 
                    <span className="ml-2 text-blue-600">{order.paymentMethod?.toUpperCase()}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4 flex gap-2 flex-wrap items-center">
                  
                  {/* Dropdown chọn status */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-gray-700">Trạng thái:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      disabled={processing[order._id] || order.status === "cancelled" || order.status === "delivered"}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="awaiting_confirmation">Chờ xác nhận thanh toán</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="shipped">Đang giao</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>

                  {/* Nếu đang chờ xác nhận thanh toán bank */}
                  {order.status === "awaiting_confirmation" && order.paymentMethod === "bank" && (
                    <button
                      onClick={() => handleConfirmPayment(order._id)}
                      disabled={processing[order._id]}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                    >
                      {processing[order._id] ? (
                        <>
                          <FaSpinner className="animate-spin" /> Đang xử lý...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle /> Xác nhận đã nhận tiền
                        </>
                      )}
                    </button>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
