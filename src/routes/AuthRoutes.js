import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

//Import Screen
import Home from '../screens/AuthScreen/Home'



const AuthNavigator = createStackNavigator({
  Home : {
    screen : Home,
    navigationOptions: {
      header : null
    }
  }
})


export default createAppContainer(AuthNavigator)

