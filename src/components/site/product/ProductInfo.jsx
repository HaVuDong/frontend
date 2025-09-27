import React from 'react'
import ProductActions from './ProductActions'

export default function ProductInfo({ product }) {
  return (
    <div className="card card-border bg-base-100 w-96">
      <div className="card-body">
        <h2 className="card-title text-4xl text-fuchsia-500">{product.productName}</h2>
        <div>
          {product.summary}
        </div>
        <p className='text-2xl'>A card component has a figure, a body part, and inside body there are title and actions parts</p>
        <p className='text-2xl text-red-500'>{product.price}$</p>
        <ProductActions />
      </div>
    </div>
  )
}
