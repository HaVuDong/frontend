import React from "react"
import API_CONFIG from "@/config/api"
import Link from 'next/link';
export default function CategoryLargeItem({ category }) {
console.log(category)
    return (
        <div className=''>
            <Link href={`/site/products/category/${category.id}`}>
            <img className="size-30 rounded-box" src={API_CONFIG.IMAGE_URL + category.attributes.image.data.attributes.url} />
            <div className="text_xs uppercase font- simibold opacity-80">{category.attributes.categoryName}</div>
            </Link>
        </div>
    )
}