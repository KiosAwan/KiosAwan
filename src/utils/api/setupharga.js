import Axios from "axios"
import { getUserToken, getUserId } from "../authhelper"
import { DEV_URL, PPOB_URL } from "src/config"
import PPOB from "src/screens/AuthScreen/PPOB/PPOB"

export {
	getListProducts,
	getSubProducts,
	setMarginProduct,
	getPPOBTransactionList,
	getDetailPPOBTransaction
}

const getListProducts = async () => {
	try {
		const token = await getUserToken()
		const res = await Axios.get(`${PPOB_URL}/service/ppob/products`, {
			headers: { "authorization": token }
		})
		return res.data
	}
	catch (error) {
		const res = error.response.data
		return res
	}
}

const getPPOBTransactionList = async (param, page) => {
	try {
		const token = await getUserToken()
		const res = await Axios.get(`${PPOB_URL}/service/ppob/transactions?page=${page}`, {
			params: param,
			headers: { "authorization": token }
		})
		return res.data
	}
	catch (error) {
		const res = error.response.data
		return res
	}
}

const getDetailPPOBTransaction = async (transactionId) => {
	try {
		const token = await getUserToken()
		const res = await Axios.get(`${PPOB_URL}/service/ppob/transaction/${transactionId}`, {
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
		const url = `${PPOB_URL}/user/${userId}/service/ppob/product/${productType}/${productId ? productId : ''}`
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
		const url = `${PPOB_URL}/user/${userId}/service/ppob/product/custom`
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