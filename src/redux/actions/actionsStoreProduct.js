import axios from 'axios'
import { HOST_URL } from '../../config';

export const getProduct = (storeid) => {
    return {
        type: "GET_PRODUCT",
        payload: axios.get(`${HOST_URL}/get_products/${storeid}`)
      };
}