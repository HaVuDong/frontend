import axiosClient from "@/lib/axiosClient"
import axios from "axios";


export  const getBrands=async(params)=>{
    try{
       return await axiosClient.get('/Brands',{'params':params})
    }
    catch(error){
     throw error;
    }
}
export const getBrandsByid=async(id,params)=>{
    try{
       return await axiosClient.get(`/Brands/${id}`,{'params':params})
    }
    catch(error){
     throw error;
    }
}
export const createbrand = async (data) => {

    try {
        console.log('Sending brand data:', data);
    return await axiosClient.post('/Brands', { "data": data });
    } catch (error) {
    throw error;
    }
    };

    export const updatebrand = async (id, data) => {
        try {
            return await axiosClient.put(`/Brands/${id}`, { "data": data });
        } catch (error) {
            throw error;
        }
    }; 

    export const deletebrand = async (id) => {
        try {
            return await axiosClient.delete(`/Brands/${id}`)
        } catch (error) {
            throw error;
    
        }
    };