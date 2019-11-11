import axios from 'axios'
import {HOST_URL} from '../config'

export const phoneValidation = (number) => {
    const IndoNumber = /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/g
    const test = IndoNumber.test("+"+number)
    return test
}

export const sendPhoneNumber = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/check_user`, data)
        return res.data
    }
    catch(error){
        const res = error.response.data
        return res
    }

}

export const sendVerifyOTP = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/valid_otp`, data)
        return res.data
    }
    catch (error) {
        const res = error.response.data
        return res
    }

}

export const sendUserPIN = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/enter_pin`, data)
        return res.data
    }
    catch (error){
        return error.response.data
    }
    
}

export const registerUser = async (data) => {
    const res = await axios.post(`${HOST_URL}/create_user`, data)
    return res.data
}