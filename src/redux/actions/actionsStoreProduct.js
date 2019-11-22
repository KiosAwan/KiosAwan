import axios from 'axios'
import { HOST_URL } from '../../config';

export const getProduct = (storeid) => {
    return {
        type: "GET_PRODUCT",
        payload: axios.get(`${HOST_URL}/get_products/${storeid}`)
      };
}

//Cart
export const AddCart = (data) => {
  return{
      type : "ADD_TO_CART",
      payload : data   
  }
}

export const removeAll = () => {
  return{
      type : "REMOVE_ALL"
  }
}

export const AddCustomer = (data) => {
  return{
      type : "ADD_CUSTOMER",
      payload : data
  }
}

export const AddQuantity = (data) => {
  return{
      type : "QUANTITY_INCREMENT",
      payload : data
  }
}
export const MinusQuantity = (data) => {
  return{
      type : "QUANTITY_DECREMENT",
      payload : data
  }
}