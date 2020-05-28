import { PPOB_URL, DEV_URL } from "src/config"
import { getUserToken, getUserId } from "../authhelper"
import axios from 'axios'

//function for send topup request
export const requestTopUp = async (data) => {
    const userToken = await getUserToken()
    const userId = await getUserId()
    try {
        const res = await axios.post(`${DEV_URL}/user/${userId}/service/topup`,
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

//function for send topup request
export const getProductPPOBList = async () => {
    const userToken = await getUserToken()
    try {
        const res = await axios.get(`${DEV_URL}/service/ppob`,
            {
                headers: { "authorization": userToken }
            }
        )
        return res.data
    } catch (err) {
        return (err.response.data)
    }
}
