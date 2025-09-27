"use client";

import React, { useEffect, useState } from "react";
import { getCategoryById, updateCategory } from "@/services/categoryService";

const CategoryEditForm = ({ id }) => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState({});
    const [categoryData, setCategoryData] = useState({
        name: "",
        description: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!categoryData.name.trim()) newErrors.name = "Tên danh mục không được để trống";
        if (!categoryData.description.trim()) newErrors.description = "Mô tả không được để trống";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setUpdating(true);

            // ✅ Format lại đúng cấu trúc server cần
            const payload = {
                categoryName: categoryData.name,
                description: categoryData.description,
            };

            console.log("📤 Dữ liệu gửi lên:", payload);

            await updateCategory(id, payload);
            alert("✅ Cập nhật danh mục thành công!");
        } catch (error) {
            console.error("❌ Lỗi cập nhật:", error.response?.data || error.message);
            alert("❌ Đã xảy ra lỗi khi cập nhật danh mục.");
        } finally {
            setUpdating(false);
        }
    };


    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await getCategoryById(id);
                const data = res.data;
                const attr = data.attributes || {};
                setCategoryData({
                    name: attr.categoryName || "",
                    description: attr.description || "",
                });
            } catch (error) {
                console.error("❌ Lỗi lấy dữ liệu:", error);
                alert("❌ Không thể tải thông tin danh mục.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCategory();
    }, [id]);

    if (loading) return <p>🔄 Đang tải thông tin danh mục...</p>;

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-4">
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Tên danh mục</label>
                <input
                    type="text"
                    name="name"
                    value={categoryData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="mb-4">
                <label className="block mb-1 font-semibold">Mô tả</label>
                <textarea
                    name="description"
                    value={categoryData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="text-right">
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    disabled={updating}
                >
                    {updating ? "Đang cập nhật..." : "💾 Lưu thay đổi"}
                </button>
            </div>
        </form>
    );
};

export default CategoryEditForm;
