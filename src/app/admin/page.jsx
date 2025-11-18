"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaMoneyBillWave,
  FaBox,
  FaShoppingCart,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { 
  getDashboardSummary,
  getMonthRevenue,
  getOrdersByStatus,
  getPaymentsByMethod
} from "@/services/adminService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0
  });
  
  const [monthRevenue, setMonthRevenue] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [paymentsByMethod, setPaymentsByMethod] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading dashboard data...");

      // Gọi API Dashboard Summary từ Backend
      const data = await getDashboardSummary();
      
      console.log("✅ Dashboard data:", data);

      // Cập nhật overview stats
      setOverview(data.data.overview.overview);
      
      // Cập nhật revenue data
      setMonthRevenue(data.data.revenue.thisMonth || []);
      
      // Cập nhật orders by status
      setOrdersByStatus(data.data.orders.byStatus || []);
      
      // Cập nhật payments by method
      setPaymentsByMethod(data.data.payments.byMethod || []);

      toast.success("✅ Đã tải dữ liệu dashboard!");
    } catch (error) {
      console.error("❌ Lỗi load dashboard:", error);
      toast.error(error.message || "Không thể tải dữ liệu dashboard!");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.info("🔄 Đang làm mới dữ liệu...");
    loadDashboardData();
  };

  // Chart: Doanh thu theo ngày trong tháng
  const revenueChartData = {
    labels: monthRevenue.map(item => {
      const day = item._id?.day || 0;
      return `${day}/${item._id?.month || 1}`;
    }),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: monthRevenue.map(item => item.revenue),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Chart: Orders by status
  const orderStatusChartData = {
    labels: ordersByStatus.map(item => {
      const statusMap = {
        'pending': 'Chờ xử lý',
        'awaiting_confirmation': 'Chờ xác nhận thanh toán',
        'confirmed': 'Đã xác nhận',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
      };
      return statusMap[item._id] || item._id;
    }),
    datasets: [
      {
        data: ordersByStatus.map(item => item.count),
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // Chart: Payments by method
  const paymentMethodChartData = {
    labels: paymentsByMethod.map(item => {
      const methodMap = {
        'cod': 'COD',
        'momo': 'MoMo',
        'vnpay': 'VNPay',
        'banking': 'Banking'
      };
      return methodMap[item._id] || item._id;
    }),
    datasets: [
      {
        data: paymentsByMethod.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-gray-600 font-medium animate-pulse">
            ⏳ Đang tải dữ liệu dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-10 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" suppressHydrationWarning></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" suppressHydrationWarning></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" suppressHydrationWarning></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              📊 Dashboard Quản Trị
            </h1>
            <p className="text-gray-600">Tổng quan hệ thống quản lý sân bóng & shop</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 font-medium flex items-center gap-2"
          >
            🔄 Làm mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FaUsers />}
            title="Tổng Users"
            value={overview.totalUsers}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<FaBox />}
            title="Tổng Sản phẩm"
            value={overview.totalProducts}
            color="from-purple-500 to-pink-600"
          />
          <StatCard
            icon={<FaShoppingCart />}
            title="Tổng Orders"
            value={overview.totalOrders}
            color="from-orange-500 to-red-600"
          />
          <StatCard
            icon={<FaMoneyBillWave />}
            title="Doanh thu"
            value={`${(overview.totalRevenue / 1000000).toFixed(1)}M`}
            color="from-green-500 to-emerald-600"
          />
        </div>

        {/* Warning Cards */}
        {(overview.lowStockProducts > 0 || overview.outOfStockProducts > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {overview.lowStockProducts > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <p className="font-bold text-yellow-800">Sản phẩm sắp hết hàng</p>
                    <p className="text-yellow-700">{overview.lowStockProducts} sản phẩm còn ít hàng</p>
                  </div>
                </div>
              </div>
            )}
            
            {overview.outOfStockProducts > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🚨</span>
                  <div>
                    <p className="font-bold text-red-800">Sản phẩm hết hàng</p>
                    <p className="text-red-700">{overview.outOfStockProducts} sản phẩm đã hết</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FaChartLine className="text-emerald-600" />
              Doanh thu tháng này
            </h2>
            {monthRevenue.length > 0 ? (
              <Bar data={revenueChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Chưa có dữ liệu doanh thu</p>
              </div>
            )}
          </div>

          {/* Order Status Chart */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Trạng thái đơn hàng
            </h2>
            {ordersByStatus.length > 0 ? (
              <Doughnut
                data={orderStatusChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { position: "bottom" },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Chưa có đơn hàng</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods & Order Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Phương thức thanh toán
            </h2>
            {paymentsByMethod.length > 0 ? (
              <Doughnut
                data={paymentMethodChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { position: "bottom" },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Chưa có thanh toán</p>
              </div>
            )}
          </div>

          {/* Order Status Stats */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 Thống kê đơn hàng
            </h2>
            <div className="space-y-3">
              {ordersByStatus.map((item, idx) => {
                const statusMap = {
                  'pending': { label: 'Chờ xử lý', icon: '⏳', color: 'yellow' },
                  'awaiting_confirmation': { label: 'Chờ xác nhận thanh toán', icon: '⏰', color: 'orange' },
                  'confirmed': { label: 'Đã xác nhận', icon: '✅', color: 'blue' },
                  'processing': { label: 'Đang xử lý', icon: '🔄', color: 'orange' },
                  'shipped': { label: 'Đang giao', icon: '🚚', color: 'purple' },
                  'delivered': { label: 'Đã giao', icon: '📦', color: 'green' },
                  'cancelled': { label: 'Đã hủy', icon: '❌', color: 'red' }
                };
                const status = statusMap[item._id] || { label: item._id, icon: '📋', color: 'gray' };
                
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{status.icon}</span>
                      <span className="font-medium">{status.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{item.count}</p>
                      <p className="text-sm text-gray-600">
                        {(item.totalAmount / 1000000).toFixed(1)}M VNĐ
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg text-white transform transition-all hover:scale-105 hover:shadow-2xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-5xl opacity-30">{icon}</div>
      </div>
    </div>
  );
}