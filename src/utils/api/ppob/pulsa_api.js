import { PPOB_URL, DEV_URL } from "src/config"
import axios from 'axios'
import { getUserToken, getUserId } from "src/utils/authhelper"

// function for get pulsa product list
export const getProductPulsa = async (data) => {
    const userToken = await getUserToken()
    try {
        const res = await axios.get(`${DEV_URL}/service/ppob/pulsa?phone_number=${data.phone_number}&type=pulsa`,
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

// // function for check nomor listrik token
// export const checkListrikToken = async (data) => {
//     const userToken = await getUserToken()
//     try {
//         const res = await axios.post(`${DEV_URL}/service/ppob/pln_prepaid/inquiry`,
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