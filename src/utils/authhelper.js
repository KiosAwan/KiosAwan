import axios from 'axios'
import { HOST_URL } from '../config'

//helper
export const convertRupiah = nominal => {
  nominal = nominal || 0
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
  let final = "Rp. " + hasil
  return final;
};

export const convertNumber = string => {
  string = string.toString()
  let matches = string.match(/\d+/g);
  let number = matches.join('');
  return Number(number)
}

//Get nearest 50.000
export const getNearestFifty = (value, multiple) => {
  let money = (Math.floor(value / 50000) + multiple) * 50000
  return money
}

export const formatToDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

export const formatToDays = (date) => {
  var d = new Date(date),
    list = d.toUTCString().split(" ")
  return list[1] + " " + list[2] + " " + list[3]
}

export const getRandomNegativeNum = () => {
  return Math.floor(Math.random() * Math.floor(3000) * -1);
}

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
  catch (error) {
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

export const editCategory = async (data, id_category) => {
  const res = await axios.post(`${HOST_URL}/update_product_category/${id_category}`, data)
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
  console.log(res)
  return res.data
}

//post new customer to database
export const sendNewCustomer = async (data) => {
  const res = await axios.post(`${HOST_URL}/create_customer`, data)
  return res.data
}

//edit customer data
export const editCustomer = async (data, id_cust) => {
  const res = await axios.post(`${HOST_URL}/update_customer/${id_cust}`, data)
  return res.data
}

//delete customer data
export const deleteCustomer = async (id_cust) => {
  const res = await axios.delete(`${HOST_URL}/delete_customer/${id_cust}`)
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
  const res = await axios.post(`${HOST_URL}/pay_debt/${transactionId}`, data)
  return res.data
}