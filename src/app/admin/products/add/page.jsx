"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaSave, FaArrowLeft, FaImage, FaTimes } from "react-icons/fa";
import { createProduct } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    stock: "",
    images: [],
    status: "active",
    specifications: {
      brand: "",
      material: "",
      size: [],
      color: [],
      weight: ""
    },
    tags: [],
    featured: false
  });

  const [tempSize, setTempSize] = useState("");
  const [tempColor, setTempColor] = useState("");
  const [tempTag, setTempTag] = useState("");
  const [tempImage, setTempImage] = useState("");

  useEffect(() => {
    console.log("🚀 Component mounted!");
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      console.log("📂 [1] START - Calling getAllCategories...");
      
      const response = await getAllCategories({ limit: 100 });
      
      console.log("📂 [2] Raw response:", response);
      console.log("📂 [3] Type of response:", typeof response);
      console.log("📂 [4] response.categories:", response.categories);
      console.log("📂 [5] response.data:", response.data);
      console.log("📂 [6] response.pagination:", response.pagination);
      
      // Thử nhiều cách parse
      let categoriesList = [];
      
      if (response.categories && Array.isArray(response.categories)) {
        categoriesList = response.categories;
        console.log("📂 [7] Using response.categories");
      } else if (response.data && Array.isArray(response.data)) {
        categoriesList = response.data;
        console.log("📂 [7] Using response.data");
      } else if (Array.isArray(response)) {
        categoriesList = response;
        console.log("📂 [7] Response itself is array");
      }
      
      console.log("📂 [8] Final categories list:", categoriesList);
      console.log("📂 [9] Is array?", Array.isArray(categoriesList));
      console.log("📂 [10] Length:", categoriesList.length);
      
      if (categoriesList.length > 0) {
        console.log("📂 [11] First category:", categoriesList[0]);
        console.log("📂 [12] First category._id:", categoriesList[0]._id);
        console.log("📂 [13] First category.name:", categoriesList[0].name);
      } else {
        console.warn("⚠️ Categories list is EMPTY!");
        toast.warning("Chưa có danh mục nào. Vui lòng tạo danh mục trước!");
      }
      
      setCategories(categoriesList);
      
    } catch (error) {
      console.error("❌ [ERROR] Loading categories:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error response:", error.response);
      toast.error("Không thể tải danh mục!");
    } finally {
      setCategoriesLoading(false);
      console.log("📂 [DONE] Categories loading finished");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({
        ...prev,
        name: value,
        slug
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const addSize = () => {
    if (tempSize.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          size: [...prev.specifications.size, tempSize.trim()]
        }
      }));
      setTempSize("");
    }
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        size: prev.specifications.size.filter((_, i) => i !== index)
      }
    }));
  };

  const addColor = () => {
    if (tempColor.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          color: [...prev.specifications.color, tempColor.trim()]
        }
      }));
      setTempColor("");
    }
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        color: prev.specifications.color.filter((_, i) => i !== index)
      }
    }));
  };

  const addTag = () => {
    if (tempTag.trim() && !formData.tags.includes(tempTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tempTag.trim()]
      }));
      setTempTag("");
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (tempImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, tempImage.trim()]
      }));
      setImagePreview(prev => [...prev, tempImage.trim()]);
      setTempImage("");
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm!");
      return;
    }
    
    if (!formData.categoryId) {
      toast.error("Vui lòng chọn danh mục!");
      return;
    }
    
    if (parseFloat(formData.price) <= 0) {
      toast.error("Giá sản phẩm phải lớn hơn 0!");
      return;
    }
    
    if (formData.images.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 ảnh sản phẩm!");
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        categoryId: formData.categoryId,
        stock: parseInt(formData.stock) || 0,
        images: formData.images,
        status: formData.status,
        featured: formData.featured,
        specifications: {
          brand: formData.specifications.brand,
          material: formData.specifications.material,
          size: formData.specifications.size,
          color: formData.specifications.color,
          weight: formData.specifications.weight
        },
        tags: formData.tags
      };

      console.log("📦 Submitting product:", productData);

      await createProduct(productData);
      
      toast.success("✅ Thêm sản phẩm thành công!");
      
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Error creating product:", error);
      toast.error(error.response?.data?.message || error.message || "Không thể thêm sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  // Log categories mỗi khi state thay đổi
  useEffect(() => {
    console.log("🔄 Categories state updated:", categories);
    console.log("🔄 Categories count:", categories.length);
  }, [categories]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-xl text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                ➕ Thêm sản phẩm mới
              </h1>
              <p className="text-gray-600 mt-1">
                Điền đầy đủ thông tin sản phẩm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            📝 Thông tin cơ bản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="san-pham-moi"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Giá bán * (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="100000"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Giá gốc (VNĐ)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="150000"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Danh mục * 
                {categoriesLoading && <span className="text-sm text-gray-500 ml-2">(Đang tải...)</span>}
                {!categoriesLoading && <span className="text-sm text-emerald-600 ml-2">({categories.length} danh mục)</span>}
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                disabled={categoriesLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-100"
              >
                <option value="">
                  {categoriesLoading ? "Đang tải danh mục..." : 
                   categories.length === 0 ? "⚠️ Chưa có danh mục" : "Chọn danh mục"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              
              {!categoriesLoading && categories.length === 0 && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/categories")}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline"
                  >
                    → Tạo danh mục đầu tiên
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Số lượng trong kho *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ẩn</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="font-medium text-gray-700">
                  ⭐ Sản phẩm nổi bật
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ... Các sections khác giữ nguyên (Thông số kỹ thuật, Hình ảnh) ... */}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <FaSave /> Lưu sản phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}