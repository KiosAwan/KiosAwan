import axios from 'axios'
import { HOST_URL } from '../config'
import { Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';


export const getImageSize = image => {
  const { width: winWidth, height: winHeight } = Dimensions.get('window')
  const imageRatio = ({ width, height }) => {
    const ratio = winWidth / width;
    return {
      width: winWidth,
      height: height * ratio
    }
  }
  return new Promise(resolve => {
    if (typeof image == 'number') {
      const { width, height } = Image.resolveAssetSource(image)
      resolve({
        size: { width, height },
        ratio: imageRatio({ width, height })
      })
    } else {
      Image.getSize(image, (width, height) => {
        resolve({
          size: { width, height },
          ratio: imageRatio({ width, height })
        })
      })
    }
  })
}

//get User token
export const getUserToken = async () => {
  const userToken = await AsyncStorage.getItem('@user_token')
  return userToken
}

//get User ID
export const getUserId = async () => {
  const userId = await AsyncStorage.getItem('userId')
  return userId
}

//helper
export const convertRupiah = (nominal = "0") => {
  return nominal.convertRupiah()
}

export const convertPhoneNumber = num => {
  num = num || 0
  const reverse = num
    .toString()
    .split("")
    .reverse()
    .join("");
  const temp_hasil = reverse.match(/\d{1,4}/g);
  const hasil = temp_hasil
    .join("-")
    .split("")
    .reverse()
    .join("");
  let final = hasil
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
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/store`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

//check new product barcode
export const checkBarcode = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/check_barcode_product`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  } catch (err) {
    return err.response.data
  }
}

//check new product barcode
export const checkProductInData = async (data) => {
  const userToken = await getUserToken()
  const res = await axios.post(`${HOST_URL}/product_scan`, data, {
    headers: { "authorization": userToken }
  })
  return res.data
}

export const getTransactionData = async (id_store, params) => {
  const userToken = await getUserToken()
  const res = await axios.get(`${HOST_URL}/transaction_data/${id_store}`, {
    params: params,
    headers: { "authorization": userToken }
  })
  return res.data
}

export const getReportCategory = async (id_store, params) => {
  const userToken = await getUserToken()
  const res = await axios.get(`${HOST_URL}/report_category/${id_store}`, {
    params: params,
    headers: { "authorization": userToken }
  })
  return res.data
}

export const getFavorites = async (page) => {
  const authorization = await getUserToken()
  const userId = await getUserId()
  const { data } = await axios.get(`${HOST_URL}/favorites/${userId}?page=${page}`, {
    headers: { authorization }
  })
  return data
}

export const deleteFavorite = async idFavorite => {
  const authorization = await getUserToken()
  const res = await axios.delete(`${HOST_URL}/favorite/${idFavorite}`, {
    headers: { authorization }
  })
  return res.data
}

export const getReportNonTunai = async (id_store, params) => {
  const userToken = await getUserToken()
  const res = await axios.get(`${HOST_URL}/report_nontunai/${id_store}`, {
    params: params,
    headers: { "authorization": userToken }
  })
  // console.debug(res.data)
  return res.data
}

export const getReportHutang = async id_store => {
  const userToken = await getUserToken()
  const res = await axios.get(`${HOST_URL}/report_hutang/${id_store}`, {
    headers: { "authorization": userToken }
  })
  // console.debug(res.data)
  return res.data
}

//post new category to database
export const sendNewCategory = async (data) => {
  const userToken = await getUserToken()
  const res = await axios.post(`${HOST_URL}/category`, data, {
    headers: { "authorization": userToken }
  })
  return res.data
}

export const editCategory = async (data, id_category) => {
  const userToken = await getUserToken()
  const res = await axios.post(`${HOST_URL}/category_update/${id_category}`, data, {
    headers: { "authorization": userToken }
  })
  return res.data
}

//delete category 
export const deleteCategory = async (categoryId) => {
  const userToken = await getUserToken()
  const res = await axios.delete(`${HOST_URL}/category/${categoryId}`, {
    headers: { "authorization": userToken }
  })
}

//delete product
export const deleteProduct = async (productId) => {
  const userToken = await getUserToken()
  const res = await axios.delete(`${HOST_URL}/product/${productId}`, {
    headers: { "authorization": userToken }
  })
}

//post new transaction to database
export const sendNewTransaction = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/transaction`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    return error.response.data
  }
}

//post new customer to database
export const sendNewCustomer = async (data) => {
  try {
    const userToken = await getUserToken()
    const res = await axios.post(`${HOST_URL}/customer`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  } catch (err) {
    return err.response.data
  }
}

//edit customer data
export const editCustomer = async (data, id_cust) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/customer_update/${id_cust}`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  } catch (err) {
    return (err.response.data)
  }
}

//delete customer data
export const deleteCustomer = async (id_cust) => {
  try {
    const userToken = await getUserToken()
    const res = await axios.delete(`${HOST_URL}/customer/${id_cust}`, {
      headers: { "authorization": userToken }
    })
    return res.data
  } catch (err) {
    return err.response.data
  }
}

//get detail transaction 
export const getTransactionDetail = async (transactionId) => {
  const userToken = await getUserToken()
  const res = await axios.get(`${HOST_URL}/transaction/${transactionId}`, {
    headers: { "authorization": userToken }
  })
  return res.data
}

//Cancel transaction 
export const cancelTransaction = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/return/`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (err) {
    return err.response.data
  }
}

//Pay Credit
export const payCredit = async (data, transactionId) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/pay_debt/${transactionId}`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  } catch (err) {
    return err.response.data
  }
}

//Create PIN
export const createUserPIN = async (data) => {
  const userToken = await getUserToken()
  const res = await axios.post(`${HOST_URL}/create_pin`, data, {
    headers: { "authorization": userToken }
  })
  return res.data
}

//Change PIN
export const changeUserPIN = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/change_pin`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

//Verify password
export const verifyUserPassword = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/valid_password`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

// Verify PIN
export const verifyUserPIN = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/enter_pin`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}


//Send OTP
export const sendOTPAuth = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/send_otp`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (err) {
    return err.response.data
  }
}


// Verify OTP
export const verifyOTPAuth = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/valid_otp`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

// Changing Email
export const changeEmail = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/change_email`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

// Send Code to Email
export const sendCodeToEmail = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/send_email`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

// Valid email
export const verifyEmailCode = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/valid_email`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

// Change New Phone Number
export const changeNewPhoneNumber = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/change_phone_number`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

// Edit store profile
export const editStoreProfile = async (data, storeId) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/store_update/${storeId}`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

// Changing Password
export const changePassword = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/change_password`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}
//Resend email verify 
export const resendVerifyEmail = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/resend_verify_email`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}

//Resend email verify 
export const addNewDiscount = async (data) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/discount`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}


//Edit Discount
export const editDiscount = async (data, id) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.post(`${HOST_URL}/discount_update/${id}`, data, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}


//Delete Discount
export const deleteDiscount = async (id) => {
  const userToken = await getUserToken()
  try {
    const res = await axios.delete(`${HOST_URL}/discount/${id}`, {
      headers: { "authorization": userToken }
    })
    return res.data
  }
  catch (error) {
    const res = error.response.data
    return res
  }
}