import { PPOB_URL, DEV_URL } from "src/config"
import axios from 'axios'
import { getUserToken, getUserId } from "src/utils/authhelper"

// function for get pdam product list
// export const getPDAMProductList = async () => {
//     const userToken = await getUserToken()
//     try {
//         const res = await axios.get(`${DEV_URL}/service/ppob/pdam/product`,
//             {
//                 headers: { "authorization": userToken }
//             }
//         )
//         return res.data
//     } catch (err) {
//         return (err.response.data)
//     }
// }

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