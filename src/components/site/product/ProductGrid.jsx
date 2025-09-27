// ProductGrid.js
import React from 'react'
import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.isArray(products) && products.length > 0 ? (
        products.map((p) => <ProductCard product={p} key={p.id} />)
      ) : (
        <p>No product found</p>
      )}
    </div>
  );

}
