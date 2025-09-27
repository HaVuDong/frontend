"use client"
import React, { useEffect, useState } from 'react'
import { getCategories } from '@/services/categoryService'
import Loading from '@/components/ui/Loading';
import CategoryItem from './CategoryItem';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      let params = {
        'populate': '*',
        'field[0]': 'categoryName',
        'field[1]': 'description'
      }
      try {
        setLoading(true);
        let data = await getCategories(params);
        setCategories(data.data);
        console.log(data.data);
        setLoading(false);
      }
      catch (error) {
        setError("có lôi .....")
      }
    }
    fetchCategories();
  }, []);
  if (loading) return <Loading/>;
  if (error) return <p className='text-red-400'>{error}</p>;



  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      {
        categories.length > 0 ? (
          categories.map((cat) => (
            <li className="list-row" key={cat.id}>
              <CategoryItem category={cat} />
            </li>
          ))
        ) : (
          <li>
            <p>No Category found</p>
          </li>
        )
      }
    </ul>
  )

}
