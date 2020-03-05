import { PPOB_URL, DEV_URL } from "src/config"
import axios from 'axios'
import { getUserToken, getUserId } from "src/utils/authhelper"


//POSTPAID

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

// function for pay tagihan listrik
export const payTagihanListrik = async (data) => {
    const userToken = await getUserToken()
    const userId = await getUserId()
    try {
        const res = await axios.post(`${DEV_URL}/user/${userId}/service/ppob/pln_postpaid/payment`,
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

//TOKEN 

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

// function for pay token
export const payTokenListrik = async (data) => {
    const userToken = await getUserToken()
    const userId = await getUserId()
    try {
        const res = await axios.post(`${DEV_URL}/user/${userId}/service/ppob/pln_prepaid/payment`,
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