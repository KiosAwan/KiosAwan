import axios from 'axios'
import { DEV_URL } from "src/config"

export const getRiwayatTransaksi = (userToken, userId) => {
    return {
        type: "GET_RIWAYAT_TRANSAKSI",
        payload: axios.get(`${DEV_URL}/user/${userId}/service/topup/history`,
            {
                headers: { "authorization": userToken }
            }
        )
    };
}