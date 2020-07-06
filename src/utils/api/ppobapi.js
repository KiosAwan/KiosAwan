import { PPOB_URL, DEV_URL } from "src/config"
import { getUserToken, getUserId } from "../authhelper"
import axios from 'axios'

//function for send topup request
export const getProductPPOBList = async () => {
    const userToken = await getUserToken()
    try {
        const res = await axios.get(`${PPOB_URL}/service/ppob/general/products`,
            {
                headers: { "authorization": userToken }
            }
        )
        console.debug(res.data)
        return res.data
    } catch (err) {
        return (err.response.data)
    }
}

export const inquiryPPOBProduct = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.post(`${PPOB_URL}/service/ppob/general/inquiry`,
            data,
            {
                headers: { "authorization": userToken }
            }
        )
        return res.data
    } catch (err) {
        return (err.response.data)
    }
}

export const paymentPPOBProduct = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.post(`${PPOB_URL}/service/ppob/general/payment`,
            data,
            {
                headers: { "authorization": userToken }
            }
        )
        console.debug(res.data)
        return res.data
    } catch (err) {
        return (err.response.data)
    }
}

export const getProductPPOBGeneral = async (type) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.get(`${PPOB_URL}/service/ppob/general/product/${type}`,
            {
                headers: { "authorization": userToken }
            }
        )
        return res.data
    } catch (err) {
        return (err.response.data)
    }
}

export const getProductPulsa = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.get(`${PPOB_URL}/service/ppob/general/product/${data.type}/${data.phone_number}`,
            {
                //Authorization with jwt
                headers: { "authorization": userToken },
            }
        )
        return res.data
    } catch (err) {
        return (err.response.data)
    }
}