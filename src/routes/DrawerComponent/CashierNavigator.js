import Stock from 'src/screens/AuthScreen/Stock'
import Cashier from 'src/screens/AuthScreen/Cashier'
import Struk from 'src/screens/AuthScreen/Struk'
import CheckOut from 'src/screens/AuthScreen/CheckOut'
import AddCartWithBarcode from 'src/screens/AuthScreen/Cashier/Main/AddCartWithBarcode'
import EWalletPayment from "src/screens/AuthScreen/Cashier/Payment/E-WalletPayment"
import NewProductName from 'src/screens/AuthScreen/Cashier/NewProductName'
import NewBarcodeProduct from 'src/screens/AuthScreen/Cashier/NewBarcodeProduct'
import NewProductLast from 'src/screens/AuthScreen/Cashier/NewProductLast'
import InputManual from 'src/screens/AuthScreen/Cashier/InputManual'
import Cart from 'src/screens/AuthScreen/Cart'
const CashierNavigator = {
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
  '/cashier/check-out/payewallet': {
    screen: EWalletPayment,
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

export default CashierNavigator