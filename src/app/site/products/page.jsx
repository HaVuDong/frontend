"use client"
import React, { useEffect, useState } from 'react'
import FilterBox from '@/components/site/filters/FilterBox'
import ProductGrid from '@/components/site/product/ProductGrid'
import { getCategories } from '@/services/categoryService'

export default function Page() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        const items = Array.isArray(data?.data) ? data.data : []
        setCategories(items)
      } catch (err) {
        console.error(err)
        setError("Không thể tải danh mục, vui lòng thử lại sau!")
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="p-4">
      {error && (
        <p className="text-red-500 text-center my-4">{error}</p>
      )}
      <FilterBox categories={categories} />
      <ProductGrid categories={categories} />
    </div>
  )
}
