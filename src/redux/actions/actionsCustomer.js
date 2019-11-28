import axios from 'axios'
import { HOST_URL } from '../../config';

export const getCustomer = (storeid) => {
    return {
        type: "GET_CUSTOMER",
        payload: axios.get(`${HOST_URL}/customers/${storeid}`)
      };
}