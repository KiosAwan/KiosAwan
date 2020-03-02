import { PPOB_URL, DEV_URL } from "src/config"
import axios from 'axios'
import { getUserToken, getUserId } from "src/utils/authhelper"

// function for check tagihan listrik postpaid
export const checkTagihanListrik = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.post(`${DEV_URL}/service/ppob/pln_postpaid/inquiry`,
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

// function for check nomor listrik token
export const checkListrikToken = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.post(`${DEV_URL}/service/ppob/pln_prepaid/inquiry`,
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