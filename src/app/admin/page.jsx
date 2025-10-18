"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaMoneyBillWave,
  FaFutbol,
  FaChartLine,
  FaCalendarCheck,
  FaClock,
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
import { dashboardService } from "@/services/dashboardService";

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
  // ✅ State management
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeFields: 0,
    totalUsers: 0,
    todayBookings: 0,
  });

  const [revenueData, setRevenueData] = useState({
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    year: new Date().getFullYear(),
  });

  const [fieldUsage, setFieldUsage] = useState([]);
  const [activities, setActivities] = useState([]);
  const [bookingStatus, setBookingStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // ✅ Load dữ liệu khi component mount hoặc selectedYear thay đổi
  useEffect(() => {
    loadDashboardData();
  }, [selectedYear]);

  /**
   * Load tất cả dữ liệu dashboard
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ Gọi service để lấy tất cả dữ liệu
      const data = await dashboardService.getAllDashboardData(selectedYear, 10);

      console.log("✅ Dashboard data loaded:", data);

      // ✅ Cập nhật state
      setStats(data.stats || stats);
      setRevenueData(data.revenue || revenueData);
      setFieldUsage(data.fieldUsage || []);
      setActivities(data.activities || []);
      setBookingStatus(data.bookingStatus || []);

      toast.success("✅ Đã tải dữ liệu dashboard!");
    } catch (error) {
      console.error("❌ Lỗi load dashboard:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải dữ liệu dashboard!"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh dữ liệu dashboard
   */
  const handleRefresh = () => {
    toast.info("🔄 Đang làm mới dữ liệu...");
    loadDashboardData();
  };

  // ✅ Chart configurations
  const revenueChartData = {
    labels: revenueData?.labels || [],
    datasets: [
      {
        label: `Doanh thu ${selectedYear} (triệu VNĐ)`,
        data: revenueData?.values || [],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const statusChartData = {
    labels: bookingStatus.map((s) => s.label),
    datasets: [
      {
        data: bookingStatus.map((s) => s.count),
        backgroundColor: bookingStatus.map((s) => s.color),
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

  // ✅ Loading state
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
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              📊 Dashboard Quản Trị
            </h1>
            <p className="text-gray-600">Tổng quan hệ thống đặt sân</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 font-medium flex items-center gap-2"
          >
            🔄 Làm mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={<FaCalendarCheck />}
            title="Tổng booking"
            value={stats.totalBookings}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<FaMoneyBillWave />}
            title="Doanh thu"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            color="from-green-500 to-emerald-600"
          />
          <StatCard
            icon={<FaFutbol />}
            title="Sân hoạt động"
            value={stats.activeFields}
            color="from-purple-500 to-pink-600"
          />
          <StatCard
            icon={<FaUsers />}
            title="Người dùng"
            value={stats.totalUsers}
            color="from-orange-500 to-red-600"
          />
          <StatCard
            icon={<FaClock />}
            title="Booking hôm nay"
            value={stats.todayBookings}
            color="from-teal-500 to-cyan-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaChartLine className="text-emerald-600" />
                Doanh thu theo tháng
              </h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {[2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <Bar data={revenueChartData} options={chartOptions} />
          </div>

          {/* Status Chart */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Trạng thái booking
            </h2>
            {bookingStatus.length > 0 ? (
              <Doughnut
                data={statusChartData}
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
                <div className="text-center">
                  <p className="text-4xl mb-2">📊</p>
                  <p>Chưa có dữ liệu</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Field Usage & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Field Usage */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaFutbol className="text-emerald-600" />
              Thống kê sử dụng sân
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {fieldUsage.length > 0 ? (
                fieldUsage.map((field, idx) => (
                  <div
                    key={field.fieldId || idx}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {field.fieldName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {field.bookingCount} lượt đặt
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">
                        {(field.totalRevenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <p className="text-4xl mb-2">⚽</p>
                    <p>Chưa có dữ liệu sử dụng sân</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activities */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🕒 Hoạt động gần đây
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        <span className="font-bold">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <p className="text-4xl mb-2">🕒</p>
                    <p>Chưa có hoạt động nào</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// ✅ Stat Card Component
function StatCard({ icon, title, value, color }) {
  return (
    <div
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg text-white transform transition-all hover:scale-105 hover:shadow-2xl`}
    >
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