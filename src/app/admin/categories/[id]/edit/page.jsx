"use client";

import { useParams } from "next/navigation";
import CategoryEditForm from "@/components/admin/categories/CategoryEditForm";

export default function EditCategory() {
    const { id } = useParams();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">📝 Sửa danh mục</h1>
            <CategoryEditForm id={id} />
        </div>
    );
}
