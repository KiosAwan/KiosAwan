import axios from 'axios'
import { HOST_URL } from '../../config';

export const getCategory = (storeid, userToken) => {
  return {
    type: "GET_CATEGORY",
    payload: axios.get(`${HOST_URL}/category/${storeid}`, {
      headers: { "authorization": userToken }
    })
  };
}