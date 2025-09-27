"use client"
import React, { useEffect, useState } from 'react'
import ProductsBox from '../product/ProductsBox'
import Loading from '@/components/ui/Loading'
import { getProducts } from '@/services/productService'

export default function NaturalProducts({searchKey, brand, priceFilter, viewOption}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        populate: '*',
        "pagination[start]": 0,
        "pagination[limit]": 5,
        'filters[tag][$contains]': 'natural',
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
        const data = await getProducts(params) // ✅ sửa chỗ này
        setProducts(data.data)
        console.log(data.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Đã xảy ra lỗi khi tải sản phẩm natural.")
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
        Natural Products Hà Vũ Đông
      </h2>
      <ProductsBox products={products} />
    </div>
  )
}
