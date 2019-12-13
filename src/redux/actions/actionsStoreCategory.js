import axios from 'axios'
import { HOST_URL } from '../../config';

export const getCategory = (storeid) => {
    return {
        type: "GET_CATEGORY",
        payload: axios.get(`${HOST_URL}/category/${storeid}`)
      };
}