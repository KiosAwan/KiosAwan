import { PPOB_URL } from "src/config"
import { getUserToken, getUserId } from "../authhelper"
import axios from 'axios'

//function for send topup request
export const requestTopUp = async (data) => {
    const userToken = await getUserToken()
    const userId = await getUserId()
    try {
        const res = await axios.post(`${PPOB_URL}/user/${userId}/service/topup`,
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

//function for 
// export const requestTopUp = async (data) => {
//     const userToken = await getUserToken()
//     const userId = await getUserId()
//     try {
//         const res = await axios.post(`${PPOB_URL}/user/${userId}/service/topup`,
//             data,
//             {
//                 headers: { "authorization": userToken }
//             }
//         )
//         return res.data
//     } catch (err) {
//         return (err.response.data)
//     }
// }