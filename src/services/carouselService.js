import axiosClient from "@/lib/axiosClient"
import axios from 'axios';


export  const getCarousels=async(params)=>{
  
    try{
       return await axiosClient.get('/carousels',{'params':params})
    }
    catch(error){
     throw error;
    }
}
export const getCarouselsByid=async(id,params)=>{
    try{
       return await axiosClient.get(`/carousels/${id}`,{'params':params})
    }
    catch(error){
     throw error;
    }
}
