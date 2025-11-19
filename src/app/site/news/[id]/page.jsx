"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  FaArrowLeft, FaSpinner, FaNewspaper, FaEye, FaCalendarAlt, 
  FaExternalLinkAlt, FaShareAlt 
} from "react-icons/fa";

import { getPostById, incrementViewCount } from "@/services/postService";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      
      // Increment view
      await incrementViewCount(postId);
      
      // Get post detail
      const response = await getPostById(postId);
      setPost(response.post);
      
    } catch (error) {
      console.error("❌ Load post error:", error);
      toast.error("Không thể tải bài viết!");
      router.push("/site/news");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã copy link!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FaNewspaper className="text-6xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy bài viết</h2>
          <button
            onClick={() => router.push("/site/news")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/site/news")}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-6 transition-all"
        >
          <FaArrowLeft />
          Quay lại danh sách tin
        </button>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Featured Image */}
          {post.image && (
            <div className="relative h-96 bg-gradient-to-br from-green-100 to-teal-100">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b mb-6">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-green-600" />
                <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleString('vi-VN') : 'N/A'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <FaEye className="text-green-600" />
                <span>{post.viewCount || 0} lượt xem</span>
              </div>

              {post.source && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Nguồn:</span>
                  <span className="font-semibold text-gray-700">{post.source}</span>
                </div>
              )}

              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-semibold"
              >
                <FaShareAlt />
                Chia sẻ
              </button>
            </div>

            {/* Summary */}
            {post.summary && (
              <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-6 rounded-r-xl">
                <p className="text-gray-700 text-lg font-semibold italic">
                  {post.summary}
                </p>
              </div>
            )}

            {/* Content */}
            {post.content && (
              <div className="prose prose-lg max-w-none mb-8">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            )}

            {/* External Link */}
            {post.link && (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Bài viết được lấy từ nguồn bên ngoài
                </p>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
                >
                  <FaExternalLinkAlt />
                  Đọc bài gốc
                </a>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
