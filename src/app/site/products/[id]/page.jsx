"use client"
import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import RelatedProducts from "@/components/site/product/RelatedProducts"
import Loading from "@/components/ui/Loading"
import ProductInfo from "@/components/site/product/ProductInfo"
import ProductImages from "@/components/site/product/ProductImages"
import { getProductsByid } from "@/services/productService" // ✅ đúng tên

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const params = { populate: '*' };
      try {
        setLoading(true);
        const data = await getProductsByid(id, params);
        setProduct(data.data.attributes);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Có lỗi xảy ra khi lấy sản phẩm");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Có lỗi: {error}</p>;

  return (
    <div className="bg-amber-100 text-center shadow-fuchsia-600 shadow-2xl m-4 rounded-xl">
      <div className="flex flex-col md:flex-row gap-2 p-8">
       <div className=" w-full md:w-2/5 flex justify-end p-0 m-0">
          <ProductImages images={product.image?.data || []} />
        </div>

        <div className="w-full md:w-3/5">
          <ProductInfo product={product} />
        </div>
      </div>
      <RelatedProducts />
    </div>
  );
}
