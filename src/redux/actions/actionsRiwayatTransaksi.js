import axios from 'axios'
import { DEV_URL } from "src/config"

export const getRiwayatTransaksi = (userToken, userId, page) => {
    // console.debug(page)
    return {
        type: "GET_RIWAYAT_TRANSAKSI",
        payload: axios.get(`${DEV_URL}/user/${userId}/service/topup/history?page=${page}`,
            {
                headers: { "authorization": userToken }
            }
        )
    };
}