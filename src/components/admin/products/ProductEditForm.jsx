"use client";
import React, { useEffect, useState } from "react";
import { getProductsByid, updateProduct } from "@/services/productService";
import BrandSelect from "./BrandSelect";
import CategorySelect from "./CategorySelect";

const ProductEditForm = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [productData, setProductData] = useState({
    productName: "",
    description: "",
    price: "",
    image: [],
    brand: "",
    category: "",
    view: "",
    sold: "",
    status: "",
    feature: "",
    ingredient: "",
    instruction: "",
    summary: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: ["price", "view", "sold"].includes(name)
        ? parseInt(value) || 0
        : name === "image"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!productData.productName.trim()) errors.productName = "Tên sản phẩm không được để trống.";
    if (!productData.description.trim()) errors.description = "Mô tả không được để trống.";
    if (productData.price <= 0) errors.price = "Giá phải lớn hơn 0.";
    if (!productData.brand) errors.brand = "Chọn thương hiệu.";
    if (!productData.category) errors.category = "Chọn danh mục.";
    if (!productData.status) errors.status = "Chọn trạng thái.";
    if (!productData.feature) errors.feature = "Nhập tính năng.";
    if (!productData.ingredient) errors.ingredient = "Nhập thành phần.";
    if (!productData.instruction) errors.instruction = "Nhập hướng dẫn.";
    if (!productData.summary) errors.summary = "Nhập tóm tắt.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      alert("❌ Vui lòng kiểm tra lại các trường bắt buộc!");
      console.warn("Lỗi nhập:", errors);
      return;
    }

    try {
      setUpdating(true);
      await updateProduct(id, productData);
      alert("✅ Cập nhật sản phẩm thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật sản phẩm:", error);
      alert("❌ Có lỗi xảy ra khi cập nhật!");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProductsByid(id);
        console.log("Product response:", res);

        // Tùy thuộc vào response mà chọn:
        const product = res.data.attributes;

        setProductData({
          productName: product.productName || "",
          description: product.description || "",
          price: product.price || 0,
          image: Array.isArray(product.image) ? product.image : [],
          brand: product.brand || "",
          category: product.category || "",
          view: product.view || 0,
          sold: product.sold || 0,
          status: product.status || "",
          feature: product.feature || "",
          ingredient: product.ingredient || "",
          instruction: product.instruction || "",
          summary: product.summary || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("❌ Lỗi khi lấy sản phẩm:", error);
        alert("❌ Không thể tải dữ liệu sản phẩm.");
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p className="text-gray-500">🔄 Đang tải dữ liệu sản phẩm...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <table className="w-full table-auto border-collapse">
        <tbody>
          <tr>
            <td className="p-2">Tên sản phẩm</td>
            <td>
              <input type="text" name="productName"
                value={productData.productName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Mô tả</td>
            <td>
              <textarea name="description"
                value={productData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Giá</td>
            <td>
              <input type="number" name="price"
                value={productData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Ảnh (ngăn cách bởi ,)</td>
            <td>
              <input type="text" name="image"
                value={productData.image.join(", ")}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Thương hiệu</td>
            <td>
              <BrandSelect value={productData.brand}
                handleInputChange={handleInputChange} />
            </td>
          </tr>
          <tr>
            <td className="p-2">Danh mục</td>
            <td>
              <CategorySelect value={productData.category}
                handleInputChange={handleInputChange} />
            </td>
          </tr>
          <tr>
            <td className="p-2">Lượt xem</td>
            <td>
              <input type="number" name="view" value={productData.view}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Đã bán</td>
            <td>
              <input type="number" name="sold" value={productData.sold}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Trạng thái</td>
            <td>
              <select name="status" value={productData.status} onChange={handleInputChange}
                className="w-full p-2 border rounded">
                <option value="">-- Chọn trạng thái --</option>
                <option value="In stock">In stock</option>
                <option value="Out stock">Out stock</option>
                <option value="Hidden">Hidden</option>
              </select>
            </td>
          </tr>
          <tr>
            <td className="p-2">Tính năng</td>
            <td>
              <textarea name="feature" value={productData.feature}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Thành phần</td>
            <td>
              <textarea name="ingredient" value={productData.ingredient}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Hướng dẫn sử dụng</td>
            <td>
              <textarea name="instruction" value={productData.instruction}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
          <tr>
            <td className="p-2">Tóm tắt</td>
            <td>
              <input type="text" name="summary" value={productData.summary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded" />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          {updating ? "Đang cập nhật..." : "💾 Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
};

export default ProductEditForm;
