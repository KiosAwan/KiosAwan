import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Home from '../screens/AuthScreen/Home'
import Stock from '../screens/AuthScreen/Stock'
import Payment from '../screens/AuthScreen/Payment'
import Cashier from '../screens/AuthScreen/Cashier'
import AddProfile from '../screens/AuthScreen/AddProfile'
import NewsScreen from '../screens/AuthScreen/NewsScreen'
import NewBarcodeProduct from '../screens/AuthScreen/NewBarcodeProduct'
import NewProductName from '../screens/AuthScreen/NewProductName'
import NewProductLast from '../screens/AuthScreen/NewProductLast'

const MainNavigator = createStackNavigator({
    Home : {
      screen : Home,
      navigationOptions: {
        header : null
      }
    },
    Cashier : {
      screen : Cashier,
      navigationOptions : {
        header : null
      }
    },
    Payment : {
      screen : Payment,
      navigationOptions : {
        header : null
      }
    },
    Stock : {
      screen : Stock,
      navigationOptions : {
        header : null
      }
    },
    NewsScreen : {
      screen : NewsScreen,
      navigationOptions : {
        header : null
      }
    },
    AddProfile : {
      screen : AddProfile,
      navigationOptions : {
        header : null
      }
    },
    NewBarcode : {
      screen : NewBarcodeProduct,
      navigationOptions : {
        header : null
      }
    },
    NewProductName : {
      screen : NewProductName,
      navigationOptions : {
        header : null
      }
    },
    NewProductLast : {
      screen : NewProductLast,
      navigationOptions : {
        header : null
      }
    }
  })

  export default createAppContainer(MainNavigator)