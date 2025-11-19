"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSave, FaSpinner } from "react-icons/fa";

import { createPost } from "@/services/postService";

export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    link: '',
    image: '',
    category: 'manual',
    status: 'published',
    author: '',
    tags: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề!");
      return;
    }

    try {
      setLoading(true);

      // Convert tags string to array
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const postData = {
        ...formData,
        tags,
        publishedAt: Date.now()
      };

      await createPost(postData);
      
      toast.success("Đã đăng tin thành công!");
      router.push('/admin/news');
    } catch (error) {
      console.error("❌ Create post error:", error);
      toast.error(error.message || "Không thể đăng tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/admin/news')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-all"
          >
            <FaArrowLeft />
            Quay lại
          </button>

          <h1 className="text-3xl font-bold text-gray-800">Đăng tin mới</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề tin tức..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
              required
            />
          </div>

          {/* Summary */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tóm tắt
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Nhập tóm tắt nội dung..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all resize-none"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nội dung
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Nhập nội dung chi tiết..."
              rows={10}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all resize-none"
            />
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Link ảnh
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-3 w-full max-w-md h-48 object-cover rounded-xl"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>

          {/* External Link */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Link bài gốc (nếu có)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com/article"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
            />
          </div>

          {/* Author */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tác giả / Nguồn
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Nhập tên tác giả hoặc nguồn tin..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
              >
                <option value="manual">Biên tập</option>
                <option value="auto">Tự động</option>
                <option value="featured">Nổi bật</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã đăng</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="bóng đá, thể thao, world cup"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Đang đăng...
                </>
              ) : (
                <>
                  <FaSave />
                  Đăng tin
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/news')}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
