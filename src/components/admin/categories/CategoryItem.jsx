import { FaTrash, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { deleteCategory, updateCategory } from "@/services/categoryService";

export default function CategoryItem({ category, stt, reload, setReload }) {
  const name = category.attributes?.categoryName;

  const handlePublishToggle = async () => {
    try {
      const isPublished = !!category.attributes.publishedAt;

      await updateCategory(category.id, {
        publishedAt: isPublished ? null : new Date().toISOString(),
      });

      setReload(reload + 1);
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      `Bạn có chắc chắn muốn xóa danh mục "${name}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteCategory(category.id);
      setReload(reload + 1);
    } catch (error) {
      console.error("❌ Lỗi khi xóa danh mục:", error.response?.data || error.message);
    }
  };

  return (
    <tr>
      <td>{stt}</td>
      <td>{name}</td>
      <td>
        {category.attributes.publishedAt ? (
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
        <Link href={`/admin/categories/${category.id}/edit`}>
          <FaEdit className="text-blue-500 hover:text-blue-700" />
        </Link>
      </td>
    </tr>
  );
}
