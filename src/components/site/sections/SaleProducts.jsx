"use client"
import React, { useEffect, useState } from 'react'
import ProductsBox from '../product/ProductsBox'
import Loading from '@/components/ui/Loading' // Đảm bảo tên file viết hoa
import { getProducts } from '@/services/productService' // ✅ sửa tên hàm

export default function NewProducts({searchKey, brand, priceFilter, viewOption}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        populate: '*',
        sort: "view:DESC", // Sắp xếp theo lượt xem
        "pagination[start]": 0,
        "pagination[limit]": 5,
        filters: {}
      }
      if (searchKey?.trim()) {
        params.filters.productName = { $contains: searchKey.trim() }
      }

      if (brand && brand !== 'all') {
        params.filters.brand = { id: { $eq: brand } }
      }

      if (priceFilter) {
        params.filters.price = { $lte: priceFilter }
      }

      if (viewOption) {
        params.publicationState = viewOption
      }

      try {
        setLoading(true)
        const data = await getProducts(params) // ✅ đúng tên hàm
        setProducts(data.data)
        console.log(data.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Có lỗi khi tải sản phẩm top view.")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchKey, brand, priceFilter, viewOption])

  if (loading) return <Loading />
  if (error) return <p className='text-red-400'>{error}</p>

  return (
    <div>
      <h2 className='text-2xl bg-blue-400 text-black mx-4 shadow-xl text-center'>
        Top view Products Hà Vũ Đông
      </h2>
      <ProductsBox products={products} />
    </div>
  )
}
