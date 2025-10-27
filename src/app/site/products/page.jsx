"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts, getProductsByCategory, searchProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { addToCart } from "@/services/cartService";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaSearch, FaShoppingCart, FaFilter, FaTimes, FaChevronDown } from "react-icons/fa";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("Tất cả danh mục");
  const [sortOption, setSortOption] = useState("default");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalProducts: 0
  });

  // ⭐ Check authentication - SYNC với SiteLayout
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('jwt');
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      
      console.log('🔐 [ProductsPage] Auth check:', {
        hasToken: !!token,
        hasUser: !!userStr,
        tokenPreview: token ? token.substring(0, 30) + '...' : 'null'
      });
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          console.log('✅ [ProductsPage] User authenticated:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('❌ [ProductsPage] Parse user error:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('⚠️ [ProductsPage] No auth data');
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    // Initial check
    checkAuth();

    // ⭐ Listen for auth changes
    const handleAuthChange = () => {
      console.log('📢 [ProductsPage] Auth changed');
      setTimeout(() => checkAuth(), 100);
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('userLoggedIn', handleAuthChange);
    window.addEventListener('userLoggedOut', handleAuthChange);

    // ⭐ Polling backup
    const interval = setInterval(() => {
      const token = Cookies.get('jwt');
      if ((token && !isAuthenticated) || (!token && isAuthenticated)) {
        console.log('🔁 [ProductsPage] Polling detected auth change');
        checkAuth();
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('userLoggedIn', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleAuthChange);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoryDropdown && !event.target.closest('.category-dropdown-container')) {
        setShowCategoryDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoryDropdown]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [pagination.page, selectedCategory, sortOption]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log("🔄 Loading categories...");
      
      const data = await getAllCategories({ 
        limit: 100,
        status: 'active' 
      });
      
      console.log("📦 Categories API Response:", data);
      
      const categoriesList = data.categories || data.data || data || [];
      
      console.log("✅ Categories loaded:", categoriesList);
      setCategories(Array.isArray(categoriesList) ? categoriesList : []);
      
      if (categoriesList.length === 0) {
        console.warn("⚠️ No categories found");
        toast.warning("Không tìm thấy danh mục nào");
      } else {
        console.log(`✅ Successfully loaded ${categoriesList.length} categories`);
      }
    } catch (error) {
      console.error("❌ Error loading categories:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Không thể tải danh mục!");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading products...", { selectedCategory, page: pagination.page });
      
      let data;
      
      if (selectedCategory) {
        console.log(`📂 Loading products for category: ${selectedCategory}`);
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };
        data = await getProductsByCategory(selectedCategory, params);
      } else {
        console.log("📦 Loading all products");
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          status: 'active',
          sortBy: sortOption === 'price-asc' || sortOption === 'price-desc' ? 'price' : 'createdAt',
          sortOrder: sortOption === 'price-asc' || sortOption === 'name-asc' ? 'asc' : 'desc'
        };
        data = await getAllProducts(params);
      }
      
      console.log("📦 Products API Response:", data);
      
      const productsList = data.products || data.data || [];
      
      // Apply client-side sorting
      let sortedList = [...productsList];
      if (sortOption === 'price-asc') {
        sortedList.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sortOption === 'price-desc') {
        sortedList.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (sortOption === 'name-asc') {
        sortedList.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === 'name-desc') {
        sortedList.sort((a, b) => b.name.localeCompare(a.name));
      }
      
      setProducts(sortedList);
      
      if (data.pagination) {
        setPagination({
          page: data.pagination.currentPage || pagination.page,
          limit: data.pagination.limit || pagination.limit,
          totalPages: data.pagination.totalPages || 1,
          totalProducts: data.pagination.totalProducts || sortedList.length
        });
      } else {
        setPagination(prev => ({
          ...prev,
          totalProducts: sortedList.length,
          totalPages: Math.ceil(sortedList.length / prev.limit)
        }));
      }
      
      console.log(`✅ Loaded ${sortedList.length} products`);
    } catch (error) {
      console.error("❌ Error loading products:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Không thể tải danh sách sản phẩm!");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      console.log("🔍 Searching for:", searchTerm);
      
      const data = await searchProducts(searchTerm);
      const productsList = data.products || data.data || [];
      
      // Filter by category if selected
      let filteredList = productsList;
      if (selectedCategory) {
        filteredList = productsList.filter(product => 
          product.categoryId?._id === selectedCategory || product.categoryId === selectedCategory
        );
      }
      
      // Apply sorting
      if (sortOption === 'price-asc') {
        filteredList.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sortOption === 'price-desc') {
        filteredList.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (sortOption === 'name-asc') {
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === 'name-desc') {
        filteredList.sort((a, b) => b.name.localeCompare(a.name));
      }
      
      setProducts(filteredList);
      setPagination(prev => ({ 
        ...prev, 
        totalProducts: filteredList.length, 
        totalPages: Math.ceil(filteredList.length / prev.limit),
        page: 1 
      }));
      toast.success(`Tìm thấy ${filteredList.length} sản phẩm`);
    } catch (error) {
      console.error("❌ Error searching:", error);
      toast.error("Không thể tìm kiếm!");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId, categoryName) => {
    console.log("📂 Category changed:", { categoryId, categoryName });
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
    setShowCategoryDropdown(false);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchTerm("");
  };

  // ⭐ ADD TO CART - Đã tối ưu với auth check chính xác
  const handleAddToCart = async (product) => {
    if (product.stock === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    // ⭐ Kiểm tra authentication chi tiết
    const token = Cookies.get('jwt');
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    console.log('🔐 [handleAddToCart] Detailed Auth Check:', {
      hasToken: !!token,
      hasUser: !!userStr,
      isAuthenticated,
      tokenPreview: token ? `${token.substring(0, 30)}...` : 'null',
      userPreview: userStr ? JSON.parse(userStr) : 'null'
    });

    if (!isAuthenticated || !token || !userStr) {
      toast.warning("⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng!");
      Cookies.set('redirectAfterLogin', window.location.pathname, { expires: 1, path: '/' });
      router.push('/site/auth/login');
      return;
    }
    
    try {
      setAddingToCart(prev => ({ ...prev, [product._id]: true }));
      
      const cartData = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || null
      };
      
      console.log("🛒 Adding to cart - Request payload:", cartData);
      console.log("🔑 Using token:", token.substring(0, 30) + '...');

      // ⭐ GỌI API addToCart
      const result = await addToCart(cartData);

      console.log("✅ Add to cart success:", result);
      toast.success(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
      
      // ⭐ Dispatch event để update cart badge
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error("❌ Add to cart error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("🔒 Phiên đăng nhập đã hết hạn!");
        
        // ⭐ Clear all auth data - sync với SiteLayout
        Cookies.remove('jwt', { path: '/' });
        Cookies.remove('role', { path: '/' });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
        
        setIsAuthenticated(false);
        setUser(null);
        
        // ⭐ Dispatch logout event
        window.dispatchEvent(new Event('userLoggedOut'));
        
        router.push('/site/auth/login');
      } else {
        const errorMsg = error.response?.data?.message 
          || error.message 
          || "Không thể thêm vào giỏ hàng!";
        toast.error(`❌ ${errorMsg}`);
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-lg animate-pulse overflow-hidden">
      <div className="w-full h-64 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-12 bg-gray-200 rounded-xl mt-4"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            🛍️ Cửa Hàng Sân Bóng
          </h1>
          <p className="text-gray-600 text-lg">
            Khám phá {pagination.totalProducts} sản phẩm chất lượng cao
          </p>
          
          {/* ⭐ Debug Info - Xóa khi deploy production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs text-gray-500">
              Auth: {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'} 
              {user && ` | User: ${user.username || user.email}`}
            </div>
          )}
        </div>

        {/* Search Bar với Category Dropdown */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Category Dropdown */}
            <div className="relative category-dropdown-container">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                disabled={loadingCategories}
                className="w-full md:w-64 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-left flex items-center justify-between hover:border-green-400 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate flex items-center gap-2">
                  📂 {loadingCategories ? "Đang tải..." : selectedCategoryName}
                </span>
                <FaChevronDown className={`ml-2 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 md:w-80 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => handleCategoryChange("", "Tất cả danh mục")}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors font-medium ${
                      selectedCategory === "" ? "bg-green-100 text-green-700 font-bold" : "text-gray-700"
                    }`}
                  >
                    📦 Tất cả danh mục
                  </button>
                  
                  {loadingCategories ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <div className="animate-spin inline-block w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
                      <p className="mt-2">Đang tải danh mục...</p>
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleCategoryChange(cat._id, cat.name)}
                        className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-t border-gray-100 font-medium ${
                          selectedCategory === cat._id ? "bg-green-100 text-green-700 font-bold" : "text-gray-700"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <p className="text-4xl mb-2">📂</p>
                      <p className="font-medium">Không có danh mục</p>
                      <button
                        onClick={loadCategories}
                        className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        Thử lại
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all text-lg"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all whitespace-nowrap"
            >
              Tìm kiếm
            </button>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden px-4 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
            >
              <FaFilter />
            </button>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Bộ lọc đang áp dụng:</span>
              
              {selectedCategory && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                  {selectedCategoryName}
                  <button
                    onClick={() => handleCategoryChange("", "Tất cả danh mục")}
                    className="hover:text-green-900"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
              
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                  Tìm kiếm: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      loadProducts();
                    }}
                    className="hover:text-blue-900"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
              
              <button
                onClick={() => {
                  setSearchTerm("");
                  handleCategoryChange("", "Tất cả danh mục");
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop & Mobile */}
          <aside className={`${showMobileFilter ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent' : 'hidden'} lg:block lg:w-72`}>
            <div className={`${showMobileFilter ? 'absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto' : ''} space-y-6 p-6 lg:p-0`}>
              {/* Close Button (Mobile) */}
              {showMobileFilter && (
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                >
                  <FaTimes size={24} />
                </button>
              )}

              {/* Sort Options */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🔀 Sắp xếp
                </h3>
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setPagination(prev => ({ ...prev, page: 1 }));
                    setShowMobileFilter(false);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all font-medium"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="name-asc">Tên A → Z</option>
                  <option value="name-desc">Tên Z → A</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory 
                    ? `Danh mục "${selectedCategoryName}" chưa có sản phẩm nào`
                    : searchTerm 
                    ? `Không tìm thấy sản phẩm với từ khóa "${searchTerm}"`
                    : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    handleCategoryChange("", "Tất cả danh mục");
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                  <p className="text-gray-600">
                    Hiển thị <span className="font-bold text-green-600">{products.length}</span> sản phẩm
                    {selectedCategory && <span> trong "{selectedCategoryName}"</span>}
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group"
                    >
                      {/* Product Image */}
                      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-7xl">📦</span>
                          </div>
                        )}
                        
                        {/* Discount Badge */}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 h-14 group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                          {product.description || "Sản phẩm chất lượng cao"}
                        </p>

                        {/* Category Badge */}
                        {product.categoryId && (
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">
                              {typeof product.categoryId === 'object' ? product.categoryId.name : ''}
                            </span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-black text-green-600">
                            {product.price?.toLocaleString()} đ
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              {product.originalPrice?.toLocaleString()} đ
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mb-4">
                          {product.stock > 0 ? (
                            <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                              ✓ Còn hàng ({product.stock})
                            </span>
                          ) : (
                            <span className="text-sm text-red-600 font-semibold flex items-center gap-1">
                              ✗ Hết hàng
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            href={`/site/products/${product._id}`}
                            className="flex-1 text-center py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                          >
                            Xem chi tiết
                          </Link>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0 || addingToCart[product._id]}
                            className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center justify-center min-w-[48px]"
                            title={product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                          >
                            {addingToCart[product._id] ? (
                              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              <FaShoppingCart />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1}
                      className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ← Trước
                    </button>
                    
                    <div className="flex gap-2 flex-wrap justify-center">
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
                            onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            className={`w-12 h-12 rounded-xl font-bold transition-all ${
                              pageNum === pagination.page
                                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-110'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-6 py-3 bg-white border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}