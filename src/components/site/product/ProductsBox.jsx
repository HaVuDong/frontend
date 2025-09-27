import React from 'react'
import ProductCard from './ProductCard'

export default function ProductsBox({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-5 gap-4 p-4">
      {
        products?.length>0?products.map((p)=><ProductCard product={p} key={p.id}/>):<p>NO product Found</p>
      }
    </div>
  )
}
