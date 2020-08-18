import axios from 'src/utils/axios'
import { HOST_URL } from '../config'

export const phoneValidation = (number) => {
    const IndoNumber = /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/g
    const test = IndoNumber.test("+" + number)
    return test
}

export const showPhoneNumber = (phonenumber) => {
    const phoneLength = phonenumber.length
    const a = phonenumber.substr(0, 2)
    const b = phonenumber.substr(8, phoneLength)
    return a + "******" + b
}

export const sendPhoneNumber = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/check_user`, data)
        return res.data
    }
    catch (error) {
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

export const loginData = async (data) => {
    console.log(data)
    try {
        const res = await axios.post(`${HOST_URL}/login`, data)
        return res.data
    } catch (error) {
        return error.response.data
    }

}

export const registerUser = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/create_user`, data)
        return res.data
    } catch (err) {
        return err.response.data
    }
}

export const sendOTP = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/send_otp`, data)
        return res.data
    }
    catch (error) {
        const res = error.response.data
        return res
    }
}

export const sendNewPassword = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/forgot_password`, data)
        return res.data
    }
    catch (error) {
        const res = error.response.data
        return res
    }
}
