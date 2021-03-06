import axios from 'axios'
import { HOST_URL } from '../../config';

export const getProduct = (storeid) => {
  return {
    type: "GET_PRODUCT",
    payload: axios.get(`${HOST_URL}/products/${storeid}`)
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

//Adding payment using cash
export const AddCashPayment = (value) => {
  return {
    type: "ADD_PAYMENT_CASH",
    payload: value
  }
}

//Adding debt date
export const AddDebtDate = (value) => {
  return {
    type: "ADD_DEBT_DATE",
    payload: value
  }
}

//Adding discount persen
export const AddDiscountPersen = (value) => {
  return {
    type: "ADD_DISCOUNT_PERSEN",
    payload: value
  }
}

//Adding discount rupiah
export const AddDiscountRupiah = (value) => {
  return {
    type: "ADD_DISCOUNT_RUPIAH",
    payload: value
  }
}

//Adding discount persen
export const AddDiscountName = (value) => {
  return {
    type: "ADD_DISCOUNT_NAME",
    payload: value
  }
}

//Adding notes persen
export const AddNotesTransaction = (value) => {
  return {
    type: "ADD_TRANSACTION_NOTES",
    payload: value
  }
}

export const ChangeCartQuantity = (item) => {
  return {
    type: "CHANGE_QUANTITY_MANUAL",
    payload: item
  }
}

export const RemoveCartProduct = (item) => {
  return {
    type: "REMOVE_SELECTED_PRODUCT",
    payload: item
  }
}



