import axios from 'axios'
import { HOST_URL } from '../../config';

export const getTransactionList = (storeid, userToken) => {
  return {
    type: "GET_TRANSACTION",
    payload: axios.get(`${HOST_URL}/transactions/${storeid}`, {
      headers: { "authorization": userToken }
    })
  };
}