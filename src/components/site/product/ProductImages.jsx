import API_CONFIG from '@/config/api'
import React from 'react'

export default function ProductImages({ images }) {
    return (
        <div className='w-96 shadow-2xl shadow-pink-300'>
            <div className='flex justify-center my-1'>
                <img
                    src={API_CONFIG.IMAGE_URL + images[0]?.attributes.url} alt="Drink"
                    className='w-[320px]'

                />
            </div>
            <div className="carousel carousel-end rounded-box">
                {
                    images.length > 0 ? images.map((img) => (
                        <div key={img.id} className="carousel-item">
                            <img src={API_CONFIG.IMAGE_URL + img.attributes.url}
                                className='w-[100px] h-[100px]'
                            />
                        </div>
                    )) : ""
                }

            </div>
        </div>
    )
}
