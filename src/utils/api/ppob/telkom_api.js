import { PPOB_URL, DEV_URL } from "src/config"
import axios from 'axios'
import { getUserToken, getUserId } from "src/utils/authhelper"

// function for get pdam product list
export const getTelkomProductList = async () => {
    const userToken = await getUserToken()
    try {
        const res = await axios.get(`${DEV_URL}/service/ppob/pascabayar/product`,
            {
                headers: { "authorization": userToken }
            }
        )
        return res.data
    } catch (err) {
        return (err.response.data)
    }
}

// function for check user bill
export const checkTagihanTelkom = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.post(`${DEV_URL}/service/ppob/pascabayar/inquiry`,
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

// function for pay pdam bill
export const payTagihanTelkom = async (data) => {
    const userToken = await getUserToken()
    const userId = await getUserId()
    try {
        const res = await axios.post(`${DEV_URL}/user/${userId}/service/ppob/pascabayar/payment`,
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