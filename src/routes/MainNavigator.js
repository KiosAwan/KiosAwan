import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import Home from '../screens/AuthScreen/Home'
import Stock from '../screens/AuthScreen/Stock'
import Payment from '../screens/AuthScreen/Payment'
import Cashier from '../screens/AuthScreen/Cashier'
import AddProfile from '../screens/AuthScreen/AddProfile'
import NewsScreen from '../screens/AuthScreen/NewsScreen'

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
    AddProfile : {
      screen : AddProfile,
      navigationOptions : {
        header : null
      }
    },
    NewsScreen : {
      screen : NewsScreen,
      navigationOptions : {
        header : null
      }
    }
  })

  export default createAppContainer(MainNavigator)