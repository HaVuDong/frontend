"use client"
import React from 'react'
import ProductActions from './ProductActions'
import API_CONFIG from '@/config/api'
import Link from 'next/link'
export default function ProductCard({ product }) {
  console.log('product: ', product)
  return (
    <div className="card bg-base-100 shadow-md shadow-green-500 card-sm rounded-xl overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-green-400">
      <Link href={`/site/products/${product.id}`}>
        <figure>
          <img
            className="w-full"
            src={API_CONFIG.IMAGE_URL + product.attributes.image?.data?.[0]?.attributes.url}
            alt={product?.attributes.productName}
          />
        </figure>
      </Link>


      <div className="card-body">
        <Link href={`/site/products/${product.id}`}>
          <h2 className="card-title">
            {product?.attributes.productName}
            <div className="badge badge-secondary">NEW</div>
          </h2>
        </Link>


        <p>{product.description}</p>
        <div>
          <div className="card-actions justify-end">
            <div className="badge badge-outline">{product?.attributes?.price}</div>
            <ProductActions />
          </div>
        </div>
      </div>
    </div>
  )
}
