import axios from 'axios'
import {HOST_URL} from '../config'

//helper
export const convertRupiah = nominal => {
    const reverse = nominal
      .toString()
      .split("")
      .reverse()
      .join("");
    const ribuan = reverse.match(/\d{1,3}/g);
    const hasil = ribuan
      .join(".")
      .split("")
      .reverse()
      .join("");
    return hasil;
  };

export const validNumber = number => {
  const tester = /^[0-9]*$/gm
  const result = tester.test(number)
  return result
}

//post data
export const sendProfileData = async (data) => {
    try {
        const res = await axios.post(`${HOST_URL}/create_store`, data)
        return res.data
    }
    catch(error){
        const res = error.response.data
        return res
    }
}

//check new product barcode
export const checkBarcode = async (data) => {
    const res = await axios.post(`${HOST_URL}/check_barcode_product`, data)
    return res.data
}

//post new category to database
export const sendNewCategory = async (data) => {
    const res = await axios.post(`${HOST_URL}/create_category`, data)
    return res.data
}

//delete category 
export const deleteCategory = async (categoryId) => {
  const res = await axios.delete(`${HOST_URL}/delete_category/${categoryId}`)
}

//delete product
export const deleteProduct = async (productId) => {
  const res = await axios.delete(`${HOST_URL}/`)
}

//post new transaction to database
export const sendNewTransaction = async (data) => {
  const res = await axios.post(`${HOST_URL}/create_transaction`, data)
  return res.data
}

//post new customer to database
export const sendNewCustomer = async (data) => {
  const res = await axios.post(`${HOST_URL}/create_customer`, data)
  return res.data
}

//get detail transaction 
export const getTransactionDetail = async (transactionId) => {
  const res = await axios.get(`${HOST_URL}/get_transaction/${transactionId}`)
  return res.data
}

//Cancel transaction 
export const cancelTransaction = async (transactionId) => {
  const res = await axios.get(`${HOST_URL}/get_transaction/${transactionId}`)
  return res.data
}

//Pay Credit
export const payCredit = async (data, transactionId) => {
  const res = await axios.post(`${HOST_URL}/pay_debt/${transactionId}`,data )
  return res.data
}