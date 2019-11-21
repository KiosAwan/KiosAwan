import axios from 'axios'
import {HOST_URL} from '../config'

export const sendProfileData = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/create_store`, data)
        return res.data
    }
    catch(error){
        const res = error.response.data
        return res
    }
}

export const checkBarcode = async (data) => {
    const res = await axios.post(`${HOST_URL}/check_barcode_product`, data)
    return res.data
}

export const sendNewCategory = async (data) => {
    const res = await axios.post(`${HOST_URL}/create_category`, data)
    return res.data
}