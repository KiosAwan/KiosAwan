import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Stock from '../../screens/AuthScreen/Stock'
import Cashier from '../../screens/AuthScreen/Cashier'
import NewBarcodeProduct from '../../screens/AuthScreen/NewBarcodeProduct'
import NewProductName from '../../screens/AuthScreen/NewProductName'
import NewProductLast from '../../screens/AuthScreen/NewProductLast'
import Cart from '../../screens/AuthScreen/Cart'
import Struk from '../../screens/AuthScreen/Struk'
import InputManual from '../../screens/AuthScreen/InputManual'
import CheckOut from '../../screens/AuthScreen/CheckOut'
import AddCartWithBarcode from '../../screens/AuthScreen/Cashier/Main/AddCartWithBarcode'

const Navs = {
  '/cashier': {
    screen: Cashier,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/stock': {
    screen: Stock,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/new-barcode': {
    screen: NewBarcodeProduct,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/new-product-name': {
    screen: NewProductName,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/new-product-last': {
    screen: NewProductLast,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/cart': {
    screen: Cart,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/check-out': {
    screen: CheckOut,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/struk': {
    screen: Struk,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/input-manual': {
    screen: InputManual,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/add-cart-with-barcode': {
    screen: AddCartWithBarcode,
    navigationOptions: {
      header: null
    }
  }
}
const CashierNavigator = createStackNavigator(Navs)

export default createAppContainer(CashierNavigator)