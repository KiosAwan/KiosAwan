import axios from 'axios'
import { PPOB_URL } from "src/config"

export const getRiwayatTransaksi = (userToken, userId) => {
    return {
        type: "GET_RIWAYAT_TRANSAKSI",
        payload: axios.get(`${PPOB_URL}/user/${userId}/service/topup/request`,
            {
                headers: { "authorization": userToken }
            }
        )
    };
}