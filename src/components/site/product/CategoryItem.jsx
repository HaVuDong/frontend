import React from "react"
import API_CONFIG from "@/config/api"
export default function CategoryItem({ category }) {
    return (
        <div className='flex items-center space-x-5'>
            <img className="size-14 rounded-box"
                src={API_CONFIG.IMAGE_URL + category.attributes.icon.data.attributes.url} />
            <div className="text_xs uppercase font- simibold opacity-80">
                {category.attributes.categoryName}
            </div>
        </div>
    )

}