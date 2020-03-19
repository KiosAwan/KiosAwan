import Axios from "axios"
import { getUserToken, getUserId } from "../authhelper"
import { DEV_URL } from "src/config"

export { getPaymentChannelList }

const getPaymentChannelList = async () => {
	try {
		const token = await getUserToken()
		const res = await Axios.get(`${DEV_URL}/service/topup/payment_channel`, {
			headers: { "authorization": token }
		})
		return res.data
	}
	catch (error) {
		const res = error.response.data
		return res
	}
}