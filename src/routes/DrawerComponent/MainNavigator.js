import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Home from '../../screens/AuthScreen/Home'
import Stock from '../../screens/AuthScreen/Stock'
import Cashier from '../../screens/AuthScreen/Cashier'
import AddProfile from '../../screens/AuthScreen/AddProfile'
import NewsScreen from '../../screens/AuthScreen/NewsScreen'
import NewBarcodeProduct from '../../screens/AuthScreen/NewBarcodeProduct'
import NewProductName from '../../screens/AuthScreen/NewProductName'
import NewProductLast from '../../screens/AuthScreen/NewProductLast'
import Cart from '../../screens/AuthScreen/Cart'
import Struk from '../../screens/AuthScreen/Struk'
import InputManual from '../../screens/AuthScreen/InputManual'
import CheckOut from '../../screens/AuthScreen/CheckOut'
const MainNavigator = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  Cashier: {
    screen: Cashier,
    navigationOptions: {
      header: null
    }
  },
  Stock: {
    screen: Stock,
    navigationOptions: {
      header: null
    }
  },
  NewsScreen: {
    screen: NewsScreen,
    navigationOptions: {
      header: null
    }
  },
  AddProfile: {
    screen: AddProfile,
    navigationOptions: {
      header: null
    }
  },
  NewBarcode: {
    screen: NewBarcodeProduct,
    navigationOptions: {
      header: null
    }
  },
  NewProductName: {
    screen: NewProductName,
    navigationOptions: {
      header: null
    }
  },
  NewProductLast: {
    screen: NewProductLast,
    navigationOptions: {
      header: null
    }
  },
  Cart: {
    screen: Cart,
    navigationOptions: {
      header: null
    }
  },
  CheckOut: {
    screen: CheckOut ,
    navigationOptions: {
      header: null
    }
  },
  Struk: {
    screen: Struk,
    navigationOptions: {
      header: null
    }
  },
  InputManual: {
    screen: InputManual,
    navigationOptions: {
      header: null
    }
  },

})

export default createAppContainer(MainNavigator)