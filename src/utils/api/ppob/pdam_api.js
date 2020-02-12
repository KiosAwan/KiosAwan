import { PPOB_URL } from "src/config"
import axios from 'axios'
import { getUserToken, getUserId } from "src/utils/authhelper"

// function for get pdam product list
export const getPDAMProductList = async () => {
    const userToken = await getUserToken()
    try {
        const res = await axios.get(`${PPOB_URL}/service/ppob/pdam/product`,
            {
                headers: { "authorization": userToken }
            }
        )
        return res.data
    } catch (err) {
        return (err.response.data)
    }
}

// function for get pdam product list
export const checkTagihan = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.post(`${PPOB_URL}/service/ppob/pdam/inquiry`,
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