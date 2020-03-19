import Axios from "axios"
import { getUserToken, getUserId } from "../authhelper"
import { DEV_URL } from "src/config"

export { getListProducts, getSubProducts, setMarginProduct }

const getListProducts = async () => {
	try {
		const token = await getUserToken()
		const res = await Axios.get(`${DEV_URL}/service/ppob/products`, {
			headers: { "authorization": token }
		})
		return res.data
	}
	catch (error) {
		const res = error.response.data
		return res
	}
}

const getSubProducts = async (productType, productId) => {
	try {
		const token = await getUserToken()
		const userId = await getUserId()
		const url = `${DEV_URL}/user/${userId}/service/ppob/product/${productType}/${productId ? productId : ''}`
		const res = await Axios.get(url, {
			headers: { "authorization": token }
		})
		return res.data
	}
	catch (error) {
		const res = error.response.data
		return res
	}
}

const setMarginProduct = async product => {
	try {
		const token = await getUserToken()
		const userId = await getUserId()
		const url = `${DEV_URL}/user/${userId}/service/ppob/product/custom`
		const res = await Axios.post(url, { product }, {
			headers: { "authorization": token }
		})
		return res.data
	}
	catch (error) {
		const res = error.response.data
		return res
	}
}