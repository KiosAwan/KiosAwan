import axios from 'axios'
import { HOST_URL } from '../../config';

export const getTransactionList = (storeid) => {
    return {
        type: "GET_TRANSACTION",
        payload: axios.get(`${HOST_URL}/get_transactions/${storeid}`)
      };
}