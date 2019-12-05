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
  return {
    type: "ADD_TO_CART_MANUAL",
    payload: data
  }
}

export const removeAllCart = () => {
  return {
    type: "REMOVE_ALL"
  }
}

export const AddCustomer = (data) => {
  return {
    type: "ADD_CUSTOMER",
    payload: data
  }
}

export const AddQuantity = (data) => {
  return {
    type: "QUANTITY_INCREMENT",
    payload: data
  }
}
export const MinusQuantity = (data) => {
  return {
    type: "QUANTITY_DECREMENT",
    payload: data
  }
}


//Adding product cart using barcode scanner
export const AddCartByBarcode = (barcode) => {
  return {
    type: "ADD_BY_BAROCDE",
    payload: barcode
  }
}

