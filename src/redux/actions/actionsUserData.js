import axios from 'axios'
import { HOST_URL } from '../../config';

export const getProfile = (userId, userToken) => {
  return {
    type: "GET_PROFILE",
    payload: axios.get(`${HOST_URL}/user/${userId}`, {
      headers: { "authorization": userToken }
    })
  };
}