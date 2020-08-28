import axios from "src/utils/axios"
import { HOST_URL } from "../../config"

export const getCustomer = (storeid, userToken) => {
	return {
		type: "GET_CUSTOMER",
		payload: axios.get(`${HOST_URL}/customers/${storeid}`, {
			headers: { authorization: userToken },
		}),
	}
}
