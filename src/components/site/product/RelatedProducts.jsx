"use client"
import React, { useEffect, useState } from 'react'
import ProductsBox from './ProductsBox'
import Loading from '@/components/ui/Loading'
import { getProducts } from '@/services/productService'

export default function RelatedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const params = {
          populate: '*',
          "pagination[start]": 0,
          "pagination[limit]": 5,
          sort: "createdAt:desc"
        }
        const res = await getProducts(params)
        setProducts(res.data)
      } catch (e) {
        setError("Không thể tải sản phẩm liên quan")
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [])

  if (loading) return <Loading />
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div>
      <h2 className="text-2xl bg-amber-400 text-black mx-4 shadow-xl text-center">Related Products Hà Vũ Đông</h2>
      <ProductsBox products={products} />
    </div>
  )
}
