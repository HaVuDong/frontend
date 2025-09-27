"use client"
import ProductEditForm from "@/components/admin/products/ProductEditForm";
import { useParams } from "next/navigation";

export default function EditProduct(){
    const {id} =useParams()
    return(
        <div className="overflow-x-auto">
            <h1 className="text-xl font-bold mb-4">Chỉnh sửa thông tin</h1>
        <ProductEditForm id ={id}/>
        </div>
    );
}