import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

//Import Screen
import Home from '../screens/AuthScreen/Home'
import Stock from '../screens/AuthScreen/Stock'
import Payment from '../screens/AuthScreen/Payment'
import Cashier from '../screens/AuthScreen/Cashier'



const AuthNavigator = createStackNavigator({
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
  }
})


export default createAppContainer(AuthNavigator)

