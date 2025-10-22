"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBox, FaExclamationTriangle } from "react-icons/fa";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getLowStockProducts,
} from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalProducts: 0
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    stock: "",
    images: [],
    status: "active"
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [pagination.page, selectedCategory, showLowStock]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      let data;
      
      if (showLowStock) {
        // Hiển thị sản phẩm sắp hết hàng
        data = await getLowStockProducts(10);
        setProducts(Array.isArray(data) ? data : data.data || []);
        setPagination(prev => ({ ...prev, totalProducts: data.length || 0 }));
      } else {
        // Hiển thị tất cả sản phẩm
        data = await getAllProducts({ 
          page: pagination.page,
          limit: pagination.limit,
          status: selectedCategory ? undefined : 'all',
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        setProducts(data.products || data.data || []);
        
        if (data.pagination) {
          setPagination({
            page: data.pagination.currentPage || pagination.page,
            limit: data.pagination.limit || pagination.limit,
            totalPages: data.pagination.totalPages || 1,
            totalProducts: data.pagination.totalProducts || 0
          });
        }
      }
      
      console.log("✅ Loaded products:", data);
    } catch (error) {
      console.error("❌ Error loading products:", error);
      toast.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getAllCategories({ limit: 100 });
      setCategories(data.categories || data.data || []);
    } catch (error) {
      console.error("❌ Error loading categories:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const data = await searchProducts(searchTerm);
      setProducts(data.products || data.data || []);
      toast.success(`Tìm thấy ${data.products?.length || 0} sản phẩm`);
    } catch (error) {
      console.error("❌ Error searching:", error);
      toast.error("Không thể tìm kiếm!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        toast.success("✅ Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(productData);
        toast.success("✅ Tạo sản phẩm thành công!");
      }
      
      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error("❌ Error saving product:", error);
      toast.error(error.response?.data?.message || error.message || "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) return;
    
    try {
      await deleteProduct(id);
      toast.success("✅ Xóa sản phẩm thành công!");
      loadProducts();
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      toast.error(error.response?.data?.message || "Không thể xóa sản phẩm!");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      categoryId: product.categoryId?._id || product.categoryId || "",
      stock: product.stock || "",
      images: product.images || [],
      status: product.status || "active"
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      originalPrice: "",
      categoryId: "",
      stock: "",
      images: [],
      status: "active"
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    if (showLowStock) return true; // Đã filter ở backend
    
    const matchSearch = searchTerm ? 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchCategory = !selectedCategory || 
      (product.categoryId?._id === selectedCategory || product.categoryId === selectedCategory);
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaBox className="text-emerald-600" />
              Quản lý Sản phẩm
            </h1>
            <p className="text-gray-600 mt-1">
              Tổng số: <span className="font-semibold text-emerald-600">{pagination.totalProducts}</span> sản phẩm
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowLowStock(!showLowStock);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                showLowStock
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              <FaExclamationTriangle />
              {showLowStock ? 'Xem tất cả' : 'Sắp hết hàng'}
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-medium"
            >
              <FaPlus /> Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {!showLowStock && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {showLowStock ? 'Không có sản phẩm sắp hết hàng' : 'Không tìm thấy sản phẩm'}
          </h3>
          <p className="text-gray-500 mb-6">
            {showLowStock 
              ? 'Tất cả sản phẩm đều còn đủ hàng trong kho'
              : 'Thử thay đổi bộ lọc hoặc tạo sản phẩm mới'}
          </p>
          {!showLowStock && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Thêm sản phẩm đầu tiên
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="h-full w-full object-cover hover:scale-110 transition-transform duration-300" 
                    />
                  ) : (
                    <span className="text-6xl">📦</span>
                  )}
                  {/* Low stock badge */}
                  {product.stock < 10 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      ⚠️ Sắp hết
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 truncate text-gray-800" title={product.name}>
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-600 font-bold text-xl">
                      {product.price?.toLocaleString()} đ
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-gray-400 line-through text-sm">
                        {product.originalPrice?.toLocaleString()} đ
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>
                      Kho: <span className={product.stock < 10 ? "text-red-500 font-semibold" : product.stock < 20 ? "text-orange-500 font-semibold" : "font-semibold"}>
                        {product.stock || 0}
                      </span>
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 font-medium"
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1 font-medium"
                    >
                      <FaTrash /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {!showLowStock && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Trước
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    page === pagination.page
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal - Form tạo/sửa sản phẩm */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingProduct ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({ 
                        ...formData, 
                        name,
                        slug: name.toLowerCase()
                          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                          .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-+|-+$/g, '')
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="san-pham-moi"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Mô tả</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Mô tả sản phẩm..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Giá bán * (VNĐ)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Giá gốc (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="150000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Danh mục *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Số lượng *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ẩn</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg font-medium transition-all"
                >
                  {editingProduct ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}