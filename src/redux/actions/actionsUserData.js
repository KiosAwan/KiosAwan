import axios from 'axios'
import { HOST_URL } from '../../config';

export const getProfile = (userId) => {
    return {
        type: "GET_PROFILE",
        payload: axios.get(`${HOST_URL}/user/${userId}`)
      };
}