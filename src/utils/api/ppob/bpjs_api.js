import { PPOB_URL, DEV_URL } from "src/config"
import axios from 'axios'
import { getUserToken, getUserId } from "src/utils/authhelper"

// function for check bpjs tagihan
export const checkTagihanBPJS = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.post(`${DEV_URL}/service/ppob/bpjs/inquiry`,
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

// function for pay tagihan bpjs
export const payTagihanBPJS = async (data) => {
    const userToken = await getUserToken()
    const userId = await getUserId()
    try {
        const res = await axios.post(`${DEV_URL}/user/${userId}/service/ppob/bpjs/payment`,
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