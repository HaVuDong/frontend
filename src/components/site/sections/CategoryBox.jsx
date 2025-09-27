"use client"
import React, { useEffect, useState } from 'react'
import { getCategories } from '@/services/categoryService'
import CategoryItem from '../product/CategoryItem'
import Loading from '@/components/ui/Loading'
import CategoryLargeItem from './CategoryLargeItem'

export default function CategoryBox() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      const params = {
        populate: '*',
        'fields[0]': 'categoryName',
        'fields[1]': 'description'
      }
      try {
        setLoading(true)
        const data = await getCategories(params)
        const items = Array.isArray(data?.data) ? data.data : []
        setCategories(items)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Đã xảy ra lỗi khi tải danh mục.")
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return <Loading />
  if (error) return <p className='text-red-400'>{error}</p>

  return (
    <ul className="flex items-center gap-16 p-3.5 -m-2.5 bg-base-100 rounded-box shadow-md">
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((cat) => (
          <li className="list-row" key={cat.id}>
            <CategoryLargeItem category={cat} />
          </li>
        ))
      ) : (
        <li>
          <p>No Category found</p>
        </li>
      )}
    </ul>
  )
}
