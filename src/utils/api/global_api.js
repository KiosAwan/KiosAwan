import Axios from "axios"
import { getUserToken, getUserId } from "../authhelper"
import { DEV_URL, HOST_URL } from "src/config"

export { getStoreCategoryAPI }

const getStoreCategoryAPI = async () => {
	try {
		const token = await getUserToken()
		const res = await Axios.get(`${HOST_URL}/store/categories`, {
			headers: { "authorization": token }
		})
		return res.data
	}
	catch (error) {
		const res = error.response.data
		return res
	}
}