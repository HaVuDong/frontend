"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  FaNewspaper, FaSpinner, FaSearch, FaEye, FaCalendarAlt, 
  FaExternalLinkAlt, FaFilter, FaTimes 
} from "react-icons/fa";

import { getAllPosts, searchPosts, incrementViewCount } from "@/services/postService";

const CATEGORIES = [
  { value: '', label: 'Tất cả' },
  { value: 'auto', label: 'Tin tự động' },
  { value: 'manual', label: 'Tin biên tập' },
  { value: 'featured', label: 'Tin nổi bật' }
];

export default function NewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    category: '',
    keyword: '',
    page: 1,
    limit: 12
  });
  const [searchInput, setSearchInput] = useState('');

  // Load posts
  useEffect(() => {
    loadPosts();
  }, [filters]);

  const loadPosts = async () => {
    try {
      setLoading(true);

      let response;
      if (filters.keyword) {
        response = await searchPosts(filters.keyword, {
          page: filters.page,
          limit: filters.limit,
          status: 'published'
        });
      } else {
        response = await getAllPosts({
          page: filters.page,
          limit: filters.limit,
          status: 'published',
          category: filters.category,
          sortBy: 'publishedAt',
          sortOrder: 'desc'
        });
      }

      setPosts(response.posts || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error("❌ Load posts error:", error);
      toast.error("Không thể tải tin tức!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({
      ...filters,
      keyword: searchInput.trim(),
      page: 1
    });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilters({
      ...filters,
      keyword: '',
      page: 1
    });
  };

  const handleCategoryChange = (category) => {
    setFilters({
      ...filters,
      category,
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadPost = async (post) => {
    try {
      // Increment view count
      await incrementViewCount(post._id);
      
      // Open link in new tab if available
      if (post.link) {
        window.open(post.link, '_blank');
      } else {
        router.push(`/site/news/${post._id}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải tin tức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FaNewspaper className="text-4xl text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tin Bóng Đá</h1>
              <p className="text-gray-600">Cập nhật liên tục 24/7</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm tin tức..."
                className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTimes />
                </button>
              )}
              
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-semibold"
              >
                Tìm
              </button>
            </div>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <FaFilter className="text-gray-500" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filters.category === cat.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filters.keyword && (
            <div className="mt-4 text-sm text-gray-600">
              Kết quả tìm kiếm cho: <span className="font-bold text-gray-800">"{filters.keyword}"</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <p className="text-gray-600 text-center">
            Tổng số: <span className="font-bold text-green-600">{pagination.total || 0}</span> tin tức
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Không có tin tức</h3>
            <p className="text-gray-500">Chưa có tin tức nào được đăng tải.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handleReadPost(post)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-teal-100 overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaNewspaper className="text-6xl text-green-300" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {post.category && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                      {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {post.summary || 'Nhấn để đọc thêm...'}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FaEye />
                        <span>{post.viewCount || 0}</span>
                      </div>
                      
                      {post.link && (
                        <FaExternalLinkAlt className="text-green-600" />
                      )}
                    </div>
                  </div>

                  {/* Source */}
                  {post.source && (
                    <div className="mt-2 text-xs text-gray-400 italic">
                      Nguồn: {post.source}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Trước
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      pagination.page === pageNum
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Sau
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Trang {pagination.page} / {pagination.totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
