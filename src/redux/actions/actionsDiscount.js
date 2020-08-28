import axios from "src/utils/axios"
import { HOST_URL } from "../../config"

export const getDiscount = storeid => {
	return {
		type: "GET_DISCOUNT",
		payload: axios.get(`${HOST_URL}/discounts/${storeid}`),
	}
}
