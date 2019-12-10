import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import AsyncStorage from '@react-native-community/async-storage'


//Import Screen
import MainNavigator from './DrawerComponent/MainNavigator'
import TransactionNavigator from './DrawerComponent/TransactionNavigator';
import Setting from '../screens/AuthScreen/Setting';
import { fromLeft, flipX, flipY, zoomIn } from 'react-navigation-transitions';


const AuthNavigator = createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: {
      header: null
    }
  },
  Transaction: {
    screen: TransactionNavigator,
    navigationOptions: {
      header: null
    }
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      header: null
    }
  },
}, {
  initialRouteName: 'Main',
  // https://github.com/plmok61/react-navigation-transitions
  transitionConfig: () => fromLeft(),
})

export default createAppContainer(AuthNavigator)


