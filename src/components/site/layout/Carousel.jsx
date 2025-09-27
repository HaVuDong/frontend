"use client"

import React, { useEffect, useState } from 'react'

import Loading from '@/components/ui/Loading';
import { getCarousels } from '@/services/carouselService';
import API_CONFIG from '@/config/api';

export default function Carousel() {
   const [carousels, setCarousels]=useState([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(false);
  
    useEffect(()=>{
       const fetchcarousels= async()=>{
        
        let params = {
          'populate': '*',
       
        }
        try{
          setLoading(true);
          let data=await getCarousels(params);
          setCarousels(data.data);
          console.log(data)
          setLoading(false);
         
         
        }
        catch(error){
          setError("Có lỗi....")
  
        }
       }
       fetchcarousels();
    },[]);
    if(loading) return <Loading/>;
    if(error) return <p className='text-red-500'>Có lỗi:{error}</p>
  return (
    <div className="carousel w-full">
      {
        carousels.length>0?(carousels.map((c,i,carousels)=>(
          <div key={c.id} id={`slide${i}`} className="carousel-item relative w-full">
          <img
            src="/image/san5.jqg"
            className="w-full h-140" />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href={i==0?`#slide${carousels.length-1}`:`#slide{i-1}`} className="btn btn-circle">❮</a>
            <a href={i==carousels.length-1?`#slide0`:`#slide${i+1}`} className="btn btn-circle">❯</a>
          </div>
        </div>
        ))
        ):""
      }
   
  
  </div>
  )
}
