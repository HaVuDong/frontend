"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  FaNewspaper, FaSpinner, FaPlus, FaEdit, FaTrash, FaEye, 
  FaCalendarAlt, FaSync, FaExternalLinkAlt, FaSearch
} from "react-icons/fa";

import { getAllPosts, deletePost, triggerCrawl } from "@/services/postService";

const STATUS_CONFIG = {
  draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-700' },
  published: { label: 'Đã đăng', color: 'bg-green-100 text-green-700' },
  archived: { label: 'Lưu trữ', color: 'bg-yellow-100 text-yellow-700' }
};

const CATEGORY_CONFIG = {
  auto: { label: 'Tự động', color: 'bg-blue-100 text-blue-700' },
  manual: { label: 'Biên tập', color: 'bg-purple-100 text-purple-700' },
  featured: { label: 'Nổi bật', color: 'bg-red-100 text-red-700' }
};

export default function AdminNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    loadPosts();
  }, [filters]);

  const loadPosts = async () => {
    try {
      setLoading(true);

      const response = await getAllPosts({
        page: filters.page,
        limit: filters.limit,
        status: filters.status || undefined,
        category: filters.category || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      setPosts(response.posts || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error("❌ Load posts error:", error);
      toast.error("Không thể tải danh sách tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerCrawl = async () => {
    if (!confirm("Bạn có chắc muốn crawl tin mới ngay bây giờ?")) return;
    
    try {
      setCrawling(true);
      toast.info("Đang crawl tin tức...");
      
      const response = await triggerCrawl();
      
      toast.success(response.message || `Đã thêm ${response.newPostsCount} tin mới!`);
      
      // Reload posts
      loadPosts();
    } catch (error) {
      console.error("❌ Crawl error:", error);
      toast.error(error.message || "Không thể crawl tin!");
    } finally {
      setCrawling(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa tin này?")) return;
    
    try {
      await deletePost(id);
      toast.success("Đã xóa tin!");
      loadPosts();
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("Không thể xóa tin!");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaNewspaper className="text-3xl text-green-600" />
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Tin Bóng Đá</h1>
              </div>
              <p className="text-gray-600">
                Tổng số: <span className="font-bold text-green-600">{pagination.total || 0}</span> tin
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTriggerCrawl}
                disabled={crawling}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {crawling ? <FaSpinner className="animate-spin" /> : <FaSync />}
                {crawling ? 'Đang crawl...' : 'Crawl tin mới'}
              </button>

              <button
                onClick={() => router.push('/admin/news/create')}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
              >
                <FaPlus />
                Đăng tin mới
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none"
            >
              <option value="">Tất cả danh mục</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có tin tức</h3>
            <p className="text-gray-500 mb-6">Hãy crawl hoặc tạo tin mới!</p>
            <button
              onClick={handleTriggerCrawl}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all inline-flex items-center gap-2"
            >
              <FaSync />
              Crawl tin ngay
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tiêu đề</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Danh mục</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Trạng thái</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Lượt xem</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Ngày đăng</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {post.image && (
                            <img
                              src={post.image}
                              alt=""
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 line-clamp-2">{post.title}</p>
                            {post.source && (
                              <p className="text-xs text-gray-500 mt-1">Nguồn: {post.source}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_CONFIG[post.category]?.color || 'bg-gray-100 text-gray-700'}`}>
                          {CATEGORY_CONFIG[post.category]?.label || post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[post.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_CONFIG[post.status]?.label || post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600">
                          <FaEye />
                          <span>{post.viewCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {post.link && (
                            <a
                              href={post.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Xem bài gốc"
                            >
                              <FaExternalLinkAlt />
                            </a>
                          )}
                          <button
                            onClick={() => router.push(`/admin/news/${post._id}/edit`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Sửa"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              <span className="px-4 py-2 text-gray-700 font-semibold">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
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
