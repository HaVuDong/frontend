import React from 'react';
import { FaEye, FaEyeSlash, FaTrash, FaEdit } from "react-icons/fa";
import Link from "next/link";
import API_CONFIG from '@/config/api';
import { deleteProduct, updateProduct } from "@/services/productService";

const ProductItem = ({ product, stt, reload, setReload }) => {
    const handlePublishToggle = () => {
        if (!product?.attributes) {
            console.error("❌ Product không hợp lệ:", product);
            return;
        }

        const isPublished = !!product.attributes.publishedAt;

       updateProduct(product.id, {
            publishedAt: isPublished ? null : new Date().toISOString()
        }).then(() => {
            setReload(reload + 1);
        }).catch((err) => {
            console.error("❌ Lỗi cập nhật:", err.response?.data || err.message);
        });
    };

    const handleDelete = async () => {
        if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.attributes.productName}"?`)) return;

        try {
            await deleteProduct(product.id);
            setReload(reload + 1);
        } catch (error) {
            console.error("❌ Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
        }
    };

    const imageUrl =
        product.attributes.image?.data?.[0]?.attributes?.url
            ? API_CONFIG.IMAGE_URL + product.attributes.image.data[0].attributes.url
            : "/placeholder.png";

    return (
        <tr>
            <td>{stt}</td>
            <td>{product.attributes.productName}</td>
            <td>
                <img
                    className="w-20 h-20 object-cover rounded-md mx-auto"
                    src={imageUrl}
                    alt={product.attributes.productName}
                />
            </td>
            <td>{product.attributes.price}</td>
            <td>
                {product.attributes.publishedAt ? (
                    <FaEye
                        className="cursor-pointer text-green-600"
                        onClick={handlePublishToggle}
                    />
                ) : (
                    <FaEyeSlash
                        className="cursor-pointer text-gray-400"
                        onClick={handlePublishToggle}
                    />
                )}
            </td>
            <td className="p-2 flex gap-2 items-center">
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700"
                >
                    <FaTrash />
                </button>
                <Link href={`/admin/products/${product.id}/edit`}>
                    <FaEdit className="text-blue-500 hover:text-blue-700" />
                </Link>
            </td>
        </tr>
    );
};

export default ProductItem;
